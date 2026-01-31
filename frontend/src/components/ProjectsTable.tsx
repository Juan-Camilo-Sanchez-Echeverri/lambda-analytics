import { useMemo, useState } from 'react';


import type { Order, PaginationMeta, Project, SortKey } from '../hooks/types';

const HEADERS: Array<{ key: SortKey; label: string; sortable: true }> = [
  { key: 'name', label: 'Proyecto', sortable: true },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'progress', label: 'Progreso', sortable: true },
  { key: 'performance', label: 'Desempeño', sortable: true },
  { key: 'updatedAt', label: 'Actualizado', sortable: true },
];

interface ProjectsTableProps {
  items: Project[];
  meta: PaginationMeta;
  sort: SortKey;
  order: Order;
  onSort: (key: SortKey) => void;
  onPage: (page: number) => void;
  onLimit: (limit: number) => void;
  loading?: boolean;
  error?: unknown;
  emptyMessage?: string;
}

export function ProjectsTable({
  items,
  meta,
  sort,
  order,
  onSort,
  onPage,
  onLimit,
  loading = false,
  error,
  emptyMessage = 'No se encontraron proyectos con estos filtros.',
}: ProjectsTableProps) {
  const [localLimit, setLocalLimit] = useState<number>(meta.limit || 10);

  const sortState = useMemo(() => ({ key: sort, dir: order }), [sort, order]);

  if (error) {
    return (
      <div role="alert" className="p-4 rounded border border-red-300 bg-red-50 text-red-700">
        Ocurrió un error al cargar la tabla. Inténtalo de nuevo.
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="p-4 text-gray-600" aria-live="polite">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg bg-white">
        <thead className="bg-gray-50">
          <tr>
            {HEADERS.map((h) => (
              <th
                key={h.key}
                scope="col"
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
                onClick={() => onSort(h.key)}
              >
                <span className="inline-flex items-center">
                  {h.label}
                  {sortState.key === h.key && (
                    <span className="ml-1 text-xs">
                      {sortState.dir === 'ASC' ? '▲' : '▼'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y">
          {loading
            ? [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-3/4" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/2" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/3" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/4" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/5" /></td>
                </tr>
              ))
            : items.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2 text-sm">{p.name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    > 
                      {p.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'} 
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {`${p.progress}%`}
                  </td>
                  <td className="px-4 py-2">
                    {`${p.performance}%`}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {new Date(p.updatedAt).toLocaleString() }
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-3">
        <div className="text-sm text-gray-600">
          Página <strong>{meta.page}</strong> de <strong>{meta.pages}</strong> — {meta.total} resultados
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 border rounded disabled:opacity-50"
            onClick={() => onPage(Math.max(1, meta.page - 1))}
            disabled={loading || meta.page <= 1}
          >
            Anterior
          </button>
          <button
            className="px-3 py-1.5 border rounded disabled:opacity-50"
            onClick={() => onPage(Math.min(meta.page + 1, meta.pages))}
            disabled={loading || meta.page >= meta.pages}
          >
            Siguiente
          </button>
          <select
            className="ml-2 px-2 py-1 border rounded"
            value={localLimit}
            onChange={(e) => {
              const next = Number(e.target.value);
              setLocalLimit(next);
              onLimit(next);
            }}
            disabled={loading}
            aria-label="Page size (limit)"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}/página
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}