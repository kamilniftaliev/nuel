import { formatDistanceToNow } from "date-fns";
import { Tag } from "@/components";

export function percentageRenderer(value: number | string) {
  if (typeof value !== "number") return value;

  const percentage = value * 100;

  return (
    <Tag
      className={{
        "bg-green-600": percentage >= 90,
        "bg-yellow-600": percentage < 90 && percentage >= 70,
        "bg-red-600": percentage < 10,
      }}
    >
      {`${percentage}%`}
    </Tag>
  );
}

export function tagRenderer(value: string | number) {
  return <Tag useRandomColor>{`${value}`}</Tag>;
}

export function dateRenderer(value: string | number) {
  return formatDistanceToNow(value, {
    addSuffix: true,
  });
}
