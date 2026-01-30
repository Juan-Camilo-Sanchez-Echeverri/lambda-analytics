import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

interface UseProjectsReturn {
  projects: Project[];
  summary: Summary | null;
  meta: PaginationMeta;
  loading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
  filterBy: (q: string, status?: ProjectStatus | 'all') => void;
  sortBy: (sort: SortKey) => void;
  goToPage: (p: number) => void;
  setLimit: (n: number) => void;
  params: Omit<Required<ProjectQuery>, 'status'> & {
    status: ProjectStatus | 'all';
  };
}

export function useProjects(
  initial: Partial<ProjectQuery & { status?: ProjectStatus | 'all' }> = {},
): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const [q, setQ] = useState<string>(initial.q ?? '');
  const [status, setStatus] = useState<ProjectStatus | 'all'>(
    initial.status ?? 'all',
  );

  const [sort, setSort] = useState<SortKey>(initial.sort ?? 'updatedAt');
  const [order, setOrder] = useState<Order>(initial.order ?? 'DESC');
  const [page, setPage] = useState<number>(initial.page ?? 1);
  const [limit, setLimitState] = useState<number>(initial.limit ?? 10);

  const abortRef = useRef<AbortController | null>(null);

  const params = useMemo(
    () => ({ q, status, sort, order, page, limit }),
    [q, status, sort, order, page, limit],
  );

  const parseList = useCallback(
    (payload: ApiListResponse<Project>) => {
      const data: Project[] = Array.isArray(payload?.data) ? payload.data : [];
      const metaRaw = payload?.meta ?? {};

      const meta: PaginationMeta = {
        page: metaRaw.page ?? page,
        limit: metaRaw.limit ?? limit,
        total: metaRaw.total ?? data.length,
        pages: metaRaw.pages,
      };

      return { data, meta };
    },
    [page, limit],
  );

  const fetchSummary = useCallback(async (signal: AbortSignal) => {
    const { data } = await api.get<Summary>('/dashboard/summary', { signal });

    const summary = {
      totalActiveProjects: data.totalActiveProjects ?? 0,
      globalProgressAvg: data.globalProgressAvg ?? 0,
      progressByProject: data.progressByProject,
      top5ByPerformance: data.top5ByPerformance,
      criticalIndicators: data.criticalIndicators,
    };

    setSummary(summary);
  }, []);

  const fetchProjects = useCallback(
    async (signal: AbortSignal) => {
      const { data } = await api.get<ApiListResponse<Project>>('/projects', {
        params: {
          q: params.q || undefined,
          status: params.status === 'all' ? undefined : params.status,
          sort: params.sort || undefined,
          order: params.order || undefined,
          page: params.page,
          limit: params.limit,
        },
        signal,
      });

      const parsed = parseList(data);
      setProjects(parsed.data);
      setMeta(parsed.meta);
    },
    [params],
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const { signal } = abortRef.current;
      await Promise.allSettled([fetchSummary(signal), fetchProjects(signal)]);
    } catch (err: unknown) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchSummary, fetchProjects]);

  useEffect(() => {
    void refetch();
    return () => abortRef.current?.abort();
  }, [refetch]);

  const filterBy = useCallback(
    (query: string, nextStatus?: ProjectStatus | 'all') => {
      setQ(query);
      if (nextStatus !== undefined) setStatus(nextStatus);
      setPage(1);
    },
    [],
  );

  const sortBy = useCallback(
    (nextSort: SortKey) => {
      if (nextSort === sort) {
        setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
      } else {
        setSort(nextSort);
        setOrder('ASC');
      }
      setPage(1);
    },
    [sort],
  );

  const goToPage = useCallback((p: number) => setPage(p), []);
  const setLimit = useCallback((n: number) => {
    setLimitState(n);
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
