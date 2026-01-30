import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, FindOptionsWhere, ILike } from 'typeorm';

import {
  CreateIndicatorDto,
  UpdateIndicatorDto,
  FilterIndicatorDto,
} from './dto';

import { Indicator } from './entities/indicator.entity';
import { ProjectsService } from '../projects/projects.service';

export type CriticalIndicatorRow = {
  id: string;
  name: string;
  currentValue: string;
  threshold: string;
  projectId: string;
  project: string;
};

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectRepository(Indicator)
    private indicatorRepository: Repository<Indicator>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(createIndicatorDto: CreateIndicatorDto) {
    const project = await this.projectsService.findOne(
      createIndicatorDto.projectId,
    );

    const indicator = this.indicatorRepository.create({
      ...createIndicatorDto,
      project,
    });

    return this.indicatorRepository.save(indicator);
  }

  async findAll(filter: FilterIndicatorDto) {
    const {
      page,
      limit,
      sort = 'createdAt',
      order = 'DESC',
      q,
      projectId,
      criticalOnly,
    } = filter;

    const where: FindOptionsWhere<Indicator> = {};

    if (projectId) where.project = { id: projectId };

    const nameWhere = q ? { name: ILike(`%${q}%`) } : {};

    let qb = this.indicatorRepository
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.project', 'p')
      .where({ ...where, ...nameWhere });

    if (criticalOnly === 'true') {
      qb = qb.andWhere('i.currentValue < i.threshold');
    }

    qb = qb
      .orderBy(`i.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

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
    const indicator = await this.indicatorRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!indicator) throw new NotFoundException('Indicator not found');

    return indicator;
  }

  async update(id: string, updateIndicatorDto: UpdateIndicatorDto) {
    const indicator = await this.findOne(id);

    if (
      updateIndicatorDto.projectId &&
      updateIndicatorDto.projectId !== (indicator.project?.id ?? '')
    ) {
      const project = await this.projectsService.findOne(
        updateIndicatorDto.projectId,
      );

      indicator.project = project;
    }

    indicator.name = updateIndicatorDto.name ?? indicator.name;
    indicator.unit = updateIndicatorDto.unit ?? indicator.unit;

    if (updateIndicatorDto.currentValue !== undefined) {
      indicator.currentValue = updateIndicatorDto.currentValue;
    }

    if (updateIndicatorDto.threshold !== undefined) {
      indicator.threshold = updateIndicatorDto.threshold;
    }

    return this.indicatorRepository.save(indicator);
  }

  async remove(id: string) {
    const indicatorDelete = await this.indicatorRepository.delete({ id });

    if (!indicatorDelete.affected) {
      throw new NotFoundException('Indicator not found');
    }

    return { ok: true };
  }

  async getCriticalIndicators(): Promise<CriticalIndicatorRow[]> {
    return this.indicatorRepository
      .createQueryBuilder('i')
      .leftJoin('i.project', 'p')
      .select([
        'i.id AS id',
        'i.name AS name',
        'i."currentValue"::float AS "currentValue"',
        'i.threshold::float AS threshold',
        'p.id AS "projectId"',
        'p.name AS project',
      ])
      .where('i."currentValue" < i.threshold')
      .orderBy('i."currentValue" - i.threshold', 'ASC')
      .getRawMany<CriticalIndicatorRow>();
  }
}
