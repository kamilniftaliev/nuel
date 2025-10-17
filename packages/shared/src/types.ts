export type Lane = {
  id: string;
  origin: string;
  destination: string;
  cost_per_ton: number;
  volume_tons: number;
  lead_days: number;
  reliability: number;
  mode: string;
};

export type Series = Record<Lane["id"], SeriesItem[]>;

export type SeriesItem = {
  date: string;
  shipments: number;
  avg_cost_per_ton: number;
  avg_lead_days: number;
  on_time_rate: number;
};
