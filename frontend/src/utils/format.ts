export const formatPercent = (v?: number) => {
  return typeof v === 'number' ? `${v.toFixed(0)}%` : '—';
};
