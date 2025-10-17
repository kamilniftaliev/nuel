import cors from "cors";
import express from "express";
import type { Lane, Series } from "nuel-shared";
import lanes from "./lanes.json";
import series from "./series.json";

const app = express();
app.use(cors());
app.use(express.json());

// For simplicity, no filtering or pagination is implemented here.
// In a real-world scenario, I would add those features,
// especially for large datasets. But for now, since backend
// needs to be lightweight, I'll keep it simple.
app.get("/lanes", (req, res) => {
  try {
    res.json(lanes as Lane[]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// For simplicity, no filtering or pagination is implemented here.
// In a real-world scenario, I would add those features,
// especially for large datasets. But for now, since backend
// needs to be lightweight, I'll keep it simple.
app.get("/series", (req, res) => {
  try {
    res.json(series as Series);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
