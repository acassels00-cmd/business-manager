const STATUS_STYLE: Record<
  string,
  { bg: string; fg: string; dot: string; label: string }
> = {
  new: { bg: "#eef2f6", fg: "#3a3937", dot: "#898781", label: "New Lead" },
  contacted: { bg: "#e6f0fc", fg: "#184f95", dot: "#2a78d6", label: "Contacted" },
  quoted: { bg: "#fef3d9", fg: "#8a5a00", dot: "#fab219", label: "Quoted" },
  won: { bg: "#e3f6e3", fg: "#0d5c0d", dot: "#0ca30c", label: "Won" },
  lost: { bg: "#fbe6e5", fg: "#8a2222", dot: "#d03b3b", label: "Lost" },
  scheduled: { bg: "#e6f0fc", fg: "#184f95", dot: "#2a78d6", label: "Scheduled" },
  in_progress: { bg: "#fef3d9", fg: "#8a5a00", dot: "#fab219", label: "In Progress" },
  completed: { bg: "#e3f6e3", fg: "#0d5c0d", dot: "#0ca30c", label: "Completed" },
  cancelled: { bg: "#f1f0ec", fg: "#5c5b56", dot: "#898781", label: "Cancelled" },
  unpaid: { bg: "#fef3d9", fg: "#8a5a00", dot: "#fab219", label: "Unpaid" },
  paid: { bg: "#e3f6e3", fg: "#0d5c0d", dot: "#0ca30c", label: "Paid" },
  overdue: { bg: "#fbe6e5", fg: "#8a2222", dot: "#d03b3b", label: "Overdue" },
};

export default function StatusPill({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.new;
  return (
    <span
      className="status-pill"
      style={{ backgroundColor: style.bg, color: style.fg }}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: style.dot }}
      />
      {style.label}
    </span>
  );
}
