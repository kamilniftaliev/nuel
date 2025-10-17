import { compareDesc } from "date-fns";
import Image from "next/image";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { FaFilter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { TiArrowSortedDown } from "react-icons/ti";
import { FilterType, type FilterValue, SortOrder } from "@/types";
import { cn } from "@/utils";
import { Slider } from "./Slider";

import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./Button";

interface Props<T> {
  // Unique key to identify each row
  uniqueKey: keyof T;
  onRowClick?: (row: T) => void;
  data: T[];
  columns: Partial<
    Record<
      keyof T,
      {
        // Name of the column on the table header
        title: string;
        // If you want to customize how the value is displayed
        renderer?: (value: string | number) => ReactNode;
        // Type of filter to use for this column (default is Text)
        filterType?: FilterType;
        // For NumberRange filters min and max can be used to set fixed bounds
        min?: number;
        max?: number;
      }
    >
  >;
  // Message to show when there's no data
  emptyMessage?: string;
}

export function Table<T>({
  uniqueKey,
  onRowClick,
  data: originalData,
  columns,
  emptyMessage,
}: Props<T>) {
  const [filters, setFilters] = useState<{
    sortBy: keyof T | null;
    sortOrder: SortOrder;
    visible: boolean;
    columnFilters: Array<{
      slug: keyof T;
      value: FilterValue;
    }>;
  }>({
    sortBy: null,
    visible: false,
    sortOrder: SortOrder.Asc,
    columnFilters: [],
  });

  const columnSlugs = Object.keys(columns) as (keyof T)[];

  const filterValues = useMemo(() => {
    return Object.keys(columns).reduce((acc, slug) => {
      const column = columns[slug as keyof T];
      if (!column) return acc;

      const type = column.filterType;
      if (
        !type ||
        type === FilterType.Text ||
        typeof column.min === "number" ||
        typeof column.max === "number"
      ) {
        return acc;
      }

      if (type === FilterType.Options) {
        const values = originalData.map((data) => data[slug as keyof T]);
        acc[slug as keyof T] = Array.from(new Set(values));
      }

      if (type === FilterType.NumberRange) {
        const values = Array.from(
          new Set(originalData.map((data) => data[slug as keyof T]))
        ) as number[];

        acc[slug as keyof T] = [Math.min(...values), Math.max(...values)];
      }

      return acc;
    }, {} as Record<keyof T, Array<T[keyof T] | number>>);
  }, [originalData, columns]);

  const data = useMemo(() => {
    let data = originalData;

    if (filters.sortBy) {
      data = data.toSorted((a, b) => {
        if (!filters.sortBy) return 0;

        if (a[filters.sortBy] < b[filters.sortBy]) {
          return filters.sortOrder === "asc" ? -1 : 1;
        }

        if (a[filters.sortBy] > b[filters.sortBy]) {
          return filters.sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    filters.columnFilters.forEach((filter) => {
      data = data.filter((row) => {
        const type = columns[filter.slug]?.filterType || FilterType.Text;
        const value = row[filter.slug];

        if (type === FilterType.Text && typeof value === "string") {
          return value
            .toLowerCase()
            .includes((filter.value as string).toLowerCase());
        }

        if (
          type === FilterType.NumberRange &&
          Array.isArray(filter.value) &&
          typeof value === "number"
        ) {
          const [min, max] = filter.value as [number, number];

          return value >= min && value <= max;
        }

        if (type === FilterType.Options && !!filter.value) {
          return filter.value === value;
        }

        if (type === FilterType.Date && !!filter.value) {
          return (
            compareDesc(filter.value as Date, new Date(value as string)) >= 0
          );
        }

        return true;
      });
    });

    return data;
  }, [originalData, filters, columns]);

  const toggleFiltersVisibility = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full sm:w-auto">
      {originalData.length > 0 && (
        <>
          <div
            className={cn(
              "flex flex-wrap gap-4 transition-all origin-top-left duration-100 h-full items-start mt-2",
              {
                "scale-y-0 h-0": !filters.visible,
              }
            )}
            style={{
              transitionDelay: filters.visible
                ? "0ms"
                : `${columnSlugs.length * 100}ms`,
            }}
          >
            {columnSlugs.map((slug, i) => {
              const column = columns[slug];
              if (!column) return null;

              const filterType = column.filterType || FilterType.Text;
              const filterId = `filter-${slug as string}`;

              const handleChange = (newValue: FilterValue) => {
                setFilters(({ columnFilters, ...rest }) => {
                  if (!newValue && filterType !== FilterType.Options) {
                    return {
                      ...rest,
                      columnFilters: columnFilters.filter(
                        (filter) => filter.slug !== slug
                      ),
                    };
                  }

                  const alreadyApplied = columnFilters.some(
                    (filter) => filter.slug === slug
                  );

                  if (alreadyApplied) {
                    return {
                      ...rest,
                      columnFilters: columnFilters.map((filter) =>
                        filter.slug === slug
                          ? { slug, value: newValue }
                          : filter
                      ),
                    };
                  }

                  return {
                    ...rest,
                    columnFilters: columnFilters.concat([
                      { slug, value: newValue },
                    ]),
                  };
                });
              };

              const currentFilterValue = filters.columnFilters.find(
                (filter) => filter.slug === slug
              )?.value;

              const minSliderValue =
                typeof column.min === "number"
                  ? column.min
                  : filterValues[slug]?.[0];
              const maxSliderValue =
                typeof column.max === "number"
                  ? column.max
                  : filterValues[slug]?.[1];

              const [currentMin, currentMax] = (
                Array.isArray(currentFilterValue)
                  ? currentFilterValue
                  : [minSliderValue, maxSliderValue]
              ) as [number, number];

              return (
                <div
                  key={filterId}
                  style={{
                    transitionDelay: `${i * 100}ms`,
                  }}
                  className={cn(
                    "flex flex-col flex-1 sm:max-w-72 gap-1 w-full transition-opacity sm:w-auto min-w-48 h-21 bg-gray-100 dark:bg-container dark:text-white border border-gray-300 dark:border-gray-600 p-2 rounded-md",
                    {
                      "opacity-0": !filters.visible,
                    }
                  )}
                >
                  <label
                    htmlFor={filterId}
                    className="flex justify-between text-sm font-medium text-gray-700 mb-1"
                  >
                    <span className="dark:text-white">{column.title}</span>
                    {currentFilterValue && (
                      <IoClose
                        onClick={() => handleChange("")}
                        className="cursor-pointer dark:text-white"
                        size={20}
                      />
                    )}
                  </label>
                  {filterType === FilterType.Text && (
                    <input
                      id={filterId}
                      type="text"
                      value={(currentFilterValue as string) || ""}
                      placeholder={column.title}
                      onChange={(event) => handleChange(event.target.value)}
                      className="border bg-white border-gray-300 dark:border-stone-900 focus:border-primary dark:bg-input-bg rounded-md py-2 px-3 focus:outline-none"
                    />
                  )}
                  {filterType === FilterType.Date && (
                    <DatePicker
                      selected={currentFilterValue as Date}
                      onChange={handleChange}
                      className="bg-white dark:bg-input-bg dark:border-gray-500 border border-gray-300 rounded-md py-2 px-3 focus:outline-none w-full"
                      placeholderText={column.title}
                      dateFormat="PPP"
                    />
                  )}
                  {filterType === FilterType.NumberRange && (
                    <Slider
                      min={currentMin}
                      max={currentMax}
                      onChange={handleChange}
                    />
                  )}
                  {filterType === FilterType.Options && (
                    <select
                      id={filterId}
                      value={currentFilterValue as string}
                      onChange={(event) => handleChange(event.target.value)}
                      className="border bg-white border-gray-300 dark:bg-input-bg dark:border-stone-900 rounded-md py-2 px-3 focus:outline-none"
                    >
                      <option key="all" value="">
                        All
                      </option>
                      {(filterValues[slug] as string[])?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
          <Button
            className="self-start"
            onClick={toggleFiltersVisibility}
            variant="primary"
          >
            <FaFilter />
            {filters.visible ? "Hide filters" : "Show filters"}
          </Button>
        </>
      )}
      {data.length > 0 ? (
        <div className="rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 text-gray-700 dark:bg-container dark:text-white">
              <tr>
                {columnSlugs.map((slug) => {
                  const column = columns[slug as keyof T];
                  if (!column) return null;

                  return (
                    <th
                      key={slug as string}
                      className="py-3 px-6 text-left cursor-pointer"
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          sortBy: slug as keyof T,
                          sortOrder:
                            prevFilters.sortBy === slug &&
                            prevFilters.sortOrder === SortOrder.Asc
                              ? SortOrder.Desc
                              : SortOrder.Asc,
                        }))
                      }
                    >
                      {column.title}
                      {filters.sortBy === slug && (
                        <TiArrowSortedDown
                          className={`inline-block ml-1 -mt-0.5 ${
                            filters.sortOrder === SortOrder.Asc
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row[uniqueKey] as string}
                  className={cn(
                    "text-gray-700 even:bg-gray-50 dark:even:bg-neutral-900 dark:text-white",
                    {
                      "cursor-pointer hover:bg-gray-100 dark:hover:bg-stone-900":
                        !!onRowClick,
                    }
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columnSlugs.map((slug) => {
                    const column = columns[slug as keyof T];
                    if (!column) return null;

                    const value = row[slug as keyof T] as string | number;

                    return (
                      <td key={slug as string} className="py-3 px-6 ">
                        {column.renderer ? column.renderer(value) : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center">
          <Image
            src="/empty.png"
            className="mx-auto"
            width={128}
            height={128}
            alt="Nothing to show"
          />
          <p className="text-xl mt-8">{emptyMessage || "No data available"}</p>
        </div>
      )}
    </div>
  );
}
