
interface KpiCardProps {
  label: string;
  value: string | number;
  format?: (v: any) => string;
}

export function KpiCard({
  label,
  value,
  format = (v) => String(v),
}: KpiCardProps) {

  return (
    <div
      className="kpi-card rounded-lg p-4 shadow-sm border bg-white"
    >
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{format(value)}</div>
    </div>
  );
}