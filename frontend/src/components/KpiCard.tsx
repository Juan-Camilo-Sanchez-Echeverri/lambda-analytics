import clsx from 'clsx';

type Variant = 'default' | 'success' | 'warning' | 'danger';

interface KpiCardProps {
  label: string;
  value: string | number;
  format?: (v: any) => string;
  variant?: Variant;
}

export function KpiCard({
  label,
  value,
  format = (v) => String(v),
  variant = 'default',
}: KpiCardProps) {

  return (
    <div
      className={clsx(
        'kpi-card rounded-lg p-4 shadow-sm border bg-white',
        variant === 'success' && 'border-green-400',
        variant === 'warning' && 'border-yellow-400',
        variant === 'danger' && 'border-red-400',
      )}
    >
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{format(value)}</div>
    </div>
  );
}