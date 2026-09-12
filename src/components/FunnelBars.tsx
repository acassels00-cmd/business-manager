const ORDINAL_BLUE = ["#86b6ef", "#5598e7", "#2a78d6", "#184f95"];
const LOST_COLOR = "#d03b3b";

export default function FunnelBars({
  data,
}: {
  data: { label: string; value: number; terminal?: boolean }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-600">{d.label}</span>
            <span className="tabular-nums text-ink-500">{d.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: d.terminal ? LOST_COLOR : ORDINAL_BLUE[i % ORDINAL_BLUE.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
