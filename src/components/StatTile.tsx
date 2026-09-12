export default function StatTile({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string;
  value: string;
  sublabel?: string;
  accent?: string;
}) {
  return (
    <div className="card p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">
        {label}
      </div>
      <div
        className="mt-2 text-2xl font-semibold tabular-nums text-ink-950"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      {sublabel && <div className="mt-1 text-xs text-ink-500">{sublabel}</div>}
    </div>
  );
}
