"use client";

import type { Lane, Series } from "nuel-shared";
import { useEffect, useMemo, useState } from "react";
import { Modal, Table, ThemeToggle, YandexMap } from "@/components";
import { api, LANES_TABLE_COLUMNS, SERIES_TABLE_COLUMNS } from "@/constants";

export default function Home() {
  const [{ data: lanes, isLoading: isLoadingLanes }, setLanes] = useState<{
    isLoading?: boolean;
    data: Lane[];
    error?: string | null;
  }>({
    isLoading: true,
    data: [],
    error: null,
  });
  const [{ data: series }, setSeries] = useState<{
    isLoading?: boolean;
    data: Series | null;
    error?: string | null;
  }>({
    isLoading: true,
    data: null,
    error: null,
  });
  const [selectedLane, setSelectedLane] = useState<Lane | null>(null);

  useEffect(() => {
    api
      .get<Lane[]>("/lanes")
      .then(({ data }) => {
        setLanes({ data });
      })
      .catch(() => {
        setLanes((prev) => ({ ...prev, error: "Failed to fetch lanes" }));
      })
      .finally(() => {
        setLanes((prev) => ({ ...prev, isLoading: false }));
      });

    // For the sake of example, I'll fetch all series at once
    // here instead of per-lane by ID in the modal.
    // Also, filters will be applied on the frontend.
    api
      .get("/series")
      .then(({ data }) => {
        setSeries({ data });
      })
      .catch(() => {
        setSeries((prev) => ({ ...prev, error: "Failed to fetch series" }));
      })
      .finally(() => {
        setSeries((prev) => ({ ...prev, isLoading: false }));
      });
  }, []);

  const laneSeries = useMemo(() => {
    if (!selectedLane?.id || !series?.[selectedLane.id]) return [];

    return series[selectedLane.id];
  }, [selectedLane?.id, series]);

  return (
    <>
      <ThemeToggle className="absolute right-4 top-4" />
      <main className="flex flex-col gap-4 text-sm justify-center min-h-screen items-center p-4">
        <h1 className="text-3xl sm:text-5xl font-bold dark:text-white">
          Lanes
        </h1>
        {selectedLane && (
          <Modal onClose={() => setSelectedLane(null)}>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl text-center dark:text-white">
                Route from{" "}
                <span className="font-semibold">{selectedLane.origin}</span> to{" "}
                <span className="font-semibold">
                  {selectedLane.destination}
                </span>
              </h2>
              <div>
                <YandexMap
                  from={selectedLane.origin}
                  to={selectedLane.destination}
                />
              </div>
              <Table
                data={laneSeries}
                uniqueKey="date"
                emptyMessage="Nothing to show"
                columns={SERIES_TABLE_COLUMNS}
              />
            </div>
          </Modal>
        )}
        {!isLoadingLanes && (
          <Table
            data={lanes}
            uniqueKey="id"
            columns={LANES_TABLE_COLUMNS}
            emptyMessage="No lanes"
            onRowClick={(lane) => setSelectedLane(lane)}
          />
        )}
      </main>
    </>
  );
}
