import { useState } from "react";

interface Props {
  min: number;
  max: number;
  onChange: (value: [number, number]) => void;
}

export function Slider({ min, max, onChange }: Props) {
  const [initialMin] = useState(min);
  const [initialMax] = useState(max);

  const minGap = ((initialMax - initialMin) * 2) / 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), max - minGap);
    onChange([value, max]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), min + minGap);
    onChange([min, value]);
  };

  return (
    <div className="slider-container bg-primary rounded-sm relative">
      <input
        type="range"
        onChange={handleMinChange}
        min={initialMin}
        max={initialMax - minGap}
        value={min}
        step={minGap}
      />
      <input
        type="range"
        onChange={handleMaxChange}
        min={initialMin + minGap}
        max={initialMax}
        value={max}
        step={minGap}
      />
      <div className="flex justify-between mt-5">
        <span className="rounded-sm text-xs text-center">{min}</span>
        <span className="rounded-sm text-xs text-center">{max}</span>
      </div>
    </div>
  );
}
