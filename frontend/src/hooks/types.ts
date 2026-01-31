export type ProjectStatus = 'ACTIVE' | 'INACTIVE';

export type Order = 'ASC' | 'DESC';

export type SortKey =
  | 'name'
  | 'status'
  | 'progress'
  | 'performance'
  | 'createdAt'
  | 'updatedAt';

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: string | null;
  endDate: string | null;
  progress: number;
  performance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Indicator {
  id: string;
  project: Project;
  name: string;
  currentValue: number;
  threshold: number;
  unit?: string;
}

export interface Summary {
  totalActiveProjects: number;
  globalProgressAvg: number;
  progressByProject: Array<Pick<Project, 'id' | 'name' | 'progress'>>;
  top5ByPerformance: Array<Pick<Project, 'id' | 'name' | 'performance'>>;
  criticalIndicators: Array<
    Pick<
      Indicator,
      'id' | 'name' | 'currentValue' | 'threshold' | 'project'
    > & { projectId: string }
  >;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ProjectQuery {
  q?: string;
  status?: ProjectStatus;
  sort?: SortKey;
  order?: Order;
  page: number;
  limit: number;
}
