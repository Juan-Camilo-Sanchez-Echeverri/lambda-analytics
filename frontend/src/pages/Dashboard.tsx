import { useMemo, useState } from 'react';

import { useProjects } from '../hooks/useProjects';
import type { ProjectStatus, SortKey } from '../hooks/types';

import { KpiCard } from '../components/KpiCard';
import { ProjectsTable } from '../components/ProjectsTable';
import { ProgressChart } from '../components/ProgressChart';

import { formatPercent } from '../utils/format';

export default function Dashboard() {
  const {
    projects,
    summary,
    meta,
    loading,
    error,
    refetch,
    filterBy,
    sortBy,
    goToPage,
    setLimit,
    params,
  } = useProjects({ limit: 10, sort: 'updatedAt', order: 'DESC' });

  const [localQ, setLocalQ] = useState<string>(params.q ?? '');
  const [localStatus, setLocalStatus] = useState<ProjectStatus | 'all'>(
    params.status ?? 'all',
  );

  const fallbackActive = useMemo(
    () => projects.filter((p) => p.status === 'ACTIVE').length,
    [projects],
  );

  const fallbackAvgProgress = useMemo(() => {
    const progressProjects = projects.map((p) => p.progress);

    return progressProjects.length ? progressProjects.reduce((a, b) => a + b, 0) / progressProjects.length : 0;

  }, [projects]);

  const chartData = useMemo(() => {
    if (!summary) {

      const dataBase = [...projects]
        .sort((a, b) => (b.performance ?? 0) - (a.performance ?? 0))
        .slice(0, 5);

      return dataBase.map((p) => ({
        name: p.name,
        progress: p.progress,
        performance: p.performance,
      }));
    }

    const progressMap = new Map(
      summary.progressByProject.map((p) => [p.id, p.progress]),
    );

    return summary.top5ByPerformance.map((b) => ({
      name: b.name,
      performance: b.performance ?? 0,
      progress: progressMap.get(b.id) ?? 0,
    }));

  }, [summary, projects]);

  const onApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    filterBy(localQ, localStatus);
  };

  const onChangeSort = (key: SortKey) => {
    sortBy(key);
  };

  return (
    <div className="dashboard p-4 md:p-6 max-w-7xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Panel de Control de Proyectos</h1>
        <p className="text-gray-600">
          Explora KPIs, desempeño y gestiona proyectos con filtros.
        </p>
      </header>

      <section className="mb-6">
        <form
          onSubmit={onApplyFilters}
          className="flex flex-col md:flex-row gap-2 md:items-end"
        >
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1" htmlFor="q">
              Buscar
            </label>
            <input
              id="q"
              type="search"
              placeholder="Nombre.."
              className="w-full border px-3 py-2 rounded"
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm text-gray-700 mb-1"
              htmlFor="status"
            >
              Estado
            </label>
            <select
              id="status"
              className="border px-3 py-2 rounded"
              value={localStatus}
              onChange={(e) =>
                setLocalStatus(e.target.value as ProjectStatus | 'all')
              }
            >
              <option value="all">Todos</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
          </div>

          <div className="flex-2 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              Aplicar
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border hover:bg-gray-50"
              onClick={() => {
                setLocalQ('');
                setLocalStatus('all');
                filterBy('', 'all');
              }}
              disabled={loading}
            >
              Limpiar
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border hover:bg-gray-50"
              onClick={refetch}
              disabled={loading}
              aria-busy={loading}
            >
              Actualizar
            </button>
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard
          label="Proyectos activos"
          value={summary?.totalActiveProjects ?? fallbackActive}
          variant="success"
        />
        <KpiCard
          label="Promedio de progreso global"
          value={summary?.globalProgressAvg ?? fallbackAvgProgress}
          format={formatPercent}
        />
        <KpiCard
          label="Indicadores críticos"
          value={summary?.criticalIndicators.length ?? 0}
          variant={
            (summary?.criticalIndicators.length ?? 0) > 0 ? 'danger' : 'default'
          }
        />
        <KpiCard
          label="Promedio de desempeño top-5"
          value={(() => {
            const arr =
              summary?.top5ByPerformance.map((t) => t.performance) ?? [];
            return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
          })()}
          format={formatPercent}
        />
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Desempeño vs Progreso (Proyectos top)
        </h2>
        {loading && !chartData.length ? (
          <div
            className="h-80 animate-pulse bg-gray-100 rounded"
            aria-busy="true"
          />
        ) : (
          <ProgressChart data={chartData} />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Proyectos</h2>
        <ProjectsTable
          items={projects}
          meta={meta}
          sort={params.sort}
          order={params.order}
          onSort={onChangeSort}
          onPage={goToPage}
          onLimit={setLimit}
          loading={loading}
          error={error}
        />
      </section>
    </div>
  );
}
