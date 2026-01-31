import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '../services/api';

import type {
  ApiListResponse,
  Order,
  PaginationMeta,
  Project,
  ProjectQuery,
  ProjectStatus,
  SortKey,
  Summary,
} from './types';

type Params = {
  q: string;
  status: ProjectStatus | 'all';
  sort: SortKey;
  order: Order;
  page: number;
  limit: number;
};

type UseProjectsReturn = {
  projects: Project[];
  summary: Summary | null;
  meta: PaginationMeta;
  loading: boolean;
  error: unknown;
  params: Params;
  refetch: () => Promise<void>;
  filterBy: (q: string, status?: ProjectStatus | 'all') => void;
  sortBy: (key: SortKey) => void;
  goToPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 1,
};

function parseListResponse(payload: ApiListResponse<Project>): {
  data: Project[];
  meta: PaginationMeta;
} {
  const data: Project[] = Array.isArray(payload?.data) ? payload.data : [];
  const metaRaw = payload?.meta ?? {};

  return {
    data,
    meta: {
      page: metaRaw.page,
      limit: metaRaw.limit,
      total: metaRaw.total,
      pages: metaRaw.pages,
    },
  };
}

export function useProjects(
  initialParams: Partial<
    ProjectQuery & { status?: ProjectStatus | 'all' }
  > = {},
): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const [q, setQ] = useState(initialParams.q ?? '');
  const [status, setStatus] = useState<ProjectStatus | 'all'>(
    initialParams.status ?? 'all',
  );

  const [sort, setSort] = useState<SortKey>(initialParams.sort ?? 'updatedAt');
  const [order, setOrder] = useState<Order>(initialParams.order ?? 'DESC');
  const [page, setPage] = useState(initialParams.page ?? 1);
  const [limit, setLimitState] = useState(initialParams.limit ?? 10);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSummary = useCallback(async (signal: AbortSignal) => {
    const { data } = await api.get<Summary>('/dashboard/summary', { signal });

    setSummary({
      totalActiveProjects: data.totalActiveProjects ?? 0,
      globalProgressAvg: data.globalProgressAvg ?? 0,
      progressByProject: data.progressByProject ?? [],
      top5ByPerformance: data.top5ByPerformance ?? [],
      criticalIndicators: data.criticalIndicators ?? [],
    });
  }, []);

  const fetchProjects = useCallback(
    async (signal: AbortSignal) => {
      const { data } = await api.get<ApiListResponse<Project>>('/projects', {
        params: {
          q: q || undefined,
          status: status === 'all' ? undefined : status,
          sort,
          order,
          page,
          limit,
        },
        signal,
      });

      const dataParsed = parseListResponse(data);
      setProjects(dataParsed.data);
      setMeta(dataParsed.meta);
    },
    [q, status, sort, order, page, limit],
  );

  const refetch = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);
    setError(null);

    try {
      await Promise.allSettled([fetchSummary(signal), fetchProjects(signal)]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchSummary, fetchProjects]);

  useEffect(() => {
    void refetch();
    return () => abortControllerRef.current?.abort();
  }, [refetch]);

  const filterBy = useCallback(
    (query: string, newStatus?: ProjectStatus | 'all') => {
      setQ(query);
      if (newStatus !== undefined) setStatus(newStatus);
      setPage(1);
    },
    [],
  );

  const sortBy = useCallback(
    (column: SortKey) => {
      if (column === sort) {
        setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
      } else {
        setSort(column);
        setOrder('ASC');
      }
      setPage(1);
    },
    [sort],
  );

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPage(1);
  }, []);

  return {
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
    params: { q, status, sort, order, page, limit },
  };
}
