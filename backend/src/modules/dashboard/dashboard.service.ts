import { Injectable } from '@nestjs/common';

import { ProjectStatus } from '@modules/projects/enums/project-status.enum';
import { ProjectsService } from '@modules/projects/projects.service';
import { IndicatorsService } from '@modules/indicators/indicators.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly indicatorsService: IndicatorsService,
  ) {}

  async summary() {
    const [totalActive, perProjectProgress, top5, criticalIndicators] =
      await Promise.all([
        this.projectsService.count({ where: { status: ProjectStatus.ACTIVE } }),
        this.projectsService.getPerProjectProgress(),
        this.projectsService.getTopByPerformance(5),
        this.indicatorsService.getCriticalIndicators(),
      ]);

    const globalAvg = perProjectProgress.length
      ? perProjectProgress.reduce((acc, p) => acc + Number(p.progress), 0) /
        perProjectProgress.length
      : 0;

    return {
      totalActiveProjects: totalActive,
      globalProgressAvg: Number(globalAvg.toFixed(2)),
      progressByProject: perProjectProgress.map((p) => ({
        id: p.id,
        name: p.name,
        progress: Number(p.progress),
      })),

      top5ByPerformance: top5.map((t) => ({
        id: t.id,
        name: t.name,
        performance: Number(t.performance),
      })),

      criticalIndicators: criticalIndicators.map((c) => ({
        id: c.id,
        name: c.name,
        currentValue: Number(c.currentValue),
        threshold: Number(c.threshold),
        projectId: c.projectId,
        project: c.project,
      })),
    };
  }
}
