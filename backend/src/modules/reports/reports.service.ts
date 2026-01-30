import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { ProjectsService } from '@modules/projects/projects.service';

import { Report } from './entities/report.entity';

import { CreateReportDto, UpdateReportDto, FilterReportDto } from './dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,

    private readonly projectsService: ProjectsService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const project = await this.projectsService.findOne(
      createReportDto.projectId,
    );

    const report = this.reportsRepository.create({
      project,
      date: createReportDto.date || new Date(),
      content: createReportDto.content,
      generatedBy: createReportDto.generatedBy,
      notes: createReportDto.notes,
    });

    return this.reportsRepository.save(report);
  }

  async findAll(filter: FilterReportDto) {
    const {
      page,
      limit,
      sort = 'date',
      order = 'DESC',
      projectId,
      from,
      to,
    } = filter;

    const where: FindOptionsWhere<Report> = {};

    if (projectId) where.project = { id: projectId };

    if (from && to) {
      where.date = Between(new Date(from), new Date(to));
    } else if (from) {
      where.date = MoreThanOrEqual(new Date(from));
    } else if (to) {
      where.date = LessThanOrEqual(new Date(to));
    }

    const [data, total] = await this.reportsRepository.findAndCount({
      where,
      relations: ['project'],
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!report) throw new NotFoundException('Report not found');

    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const report = await this.findOne(id);

    if (
      updateReportDto.projectId &&
      updateReportDto.projectId !== report.project?.id
    ) {
      const project = await this.projectsService.findOne(
        updateReportDto.projectId,
      );

      report.project = project;
    }

    if (updateReportDto.date) report.date = new Date(updateReportDto.date);
    if (updateReportDto.content !== undefined) {
      report.content = updateReportDto.content;
    }

    if (updateReportDto.generatedBy !== undefined) {
      report.generatedBy = updateReportDto.generatedBy;
    }

    if (updateReportDto.notes !== undefined) {
      report.notes = updateReportDto.notes;
    }

    return this.reportsRepository.save(report);
  }

  async remove(id: string) {
    const reportDelete = await this.reportsRepository.delete({ id });

    if (!reportDelete.affected || reportDelete.affected === 0) {
      throw new NotFoundException('Report not found');
    }

    return { ok: true };
  }
}
