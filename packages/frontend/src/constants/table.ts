import { FilterType } from "@/types";
import { dateRenderer, percentageRenderer, tagRenderer } from "@/utils";

export const LANES_TABLE_COLUMNS = {
  id: {
    title: "ID",
  },
  origin: {
    title: "Origin",
  },
  destination: {
    title: "Destination",
  },
  cost_per_ton: {
    title: "Cost",
    filterType: FilterType.NumberRange,
  },
  volume_tons: {
    title: "Volume (tons)",
    filterType: FilterType.NumberRange,
  },
  lead_days: {
    title: "Lead Time (days)",
    filterType: FilterType.NumberRange,
  },
  reliability: {
    title: "Reliability",
    filterType: FilterType.NumberRange,
    renderer: percentageRenderer,
  },
  mode: {
    title: "Mode",
    filterType: FilterType.Options,
    renderer: tagRenderer,
  },
};

export const SERIES_TABLE_COLUMNS = {
  date: {
    title: "Time",
    filterType: FilterType.Date,
    renderer: dateRenderer,
  },
  shipments: {
    title: "Shipments",
    filterType: FilterType.NumberRange,
  },
  avg_cost_per_ton: {
    title: "Avg Cost per Ton",
    filterType: FilterType.NumberRange,
  },
  avg_lead_days: {
    title: "Avg Lead Days",
    filterType: FilterType.NumberRange,
  },
  on_time_rate: {
    title: "On Time Rate",
    filterType: FilterType.NumberRange,
    renderer: percentageRenderer,
  },
};
