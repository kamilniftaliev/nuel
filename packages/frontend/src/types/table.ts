export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export enum FilterType {
  Text = "text",
  NumberRange = "number-range",
  Date = "date-range",
  Options = "options",
}

export type FilterValue =
  | [number, number]
  | number
  | string[]
  | string
  | Date
  | null;
