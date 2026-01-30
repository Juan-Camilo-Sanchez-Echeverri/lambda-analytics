import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere, FindManyOptions } from 'typeorm';

import { Project } from './entities/project.entity';
import { CreateProjectDto, FilterProjectDto, UpdateProjectDto } from './dto';

export type PerProjectProgressRow = {
  id: string;
  name: string;
  progress: string;
};

export type TopPerformanceRow = {
  id: string;
  name: string;
  performance: string;
};

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectsRepository.create(createProjectDto);

    return this.projectsRepository.save(project);
  }

  async findAll(filter: FilterProjectDto) {
    const {
      page,
      limit,
      sort = 'createdAt',
      order = 'DESC',
      q,
      status,
    } = filter;

    const where: FindOptionsWhere<Project> = {};

    if (q) where.name = ILike(`%${q}%`);

    if (status) where.status = status;

    const [data, total] = await this.projectsRepository.findAndCount({
      where,
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
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['activities', 'indicators', 'reports'],
    });

    if (!project) throw new NotFoundException('Project not found');

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const projectUpdated = await this.projectsRepository.update(
      { id },
      updateProjectDto,
    );

    if (projectUpdated.affected === 0) {
      throw new NotFoundException('Project not found');
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const projectDeleted = await this.projectsRepository.delete({ id });

    if (projectDeleted.affected === 0) {
      throw new NotFoundException('Project not found');
    }

    return { ok: true };
  }

  async count(options?: FindManyOptions<Project>) {
    return this.projectsRepository.count(options);
  }

  async getPerProjectProgress(): Promise<PerProjectProgressRow[]> {
    return this.projectsRepository
      .createQueryBuilder('p')
      .select(['p.id AS id', 'p.name AS name', 'p.progress::float AS progress'])
      .getRawMany<PerProjectProgressRow>();
  }

  async getTopByPerformance(limit = 5): Promise<TopPerformanceRow[]> {
    return this.projectsRepository
      .createQueryBuilder('p')
      .select([
        'p.id AS id',
        'p.name AS name',
        'p.performance::float AS performance',
      ])
      .orderBy('p.performance', 'DESC')
      .limit(limit)
      .getRawMany<TopPerformanceRow>();
  }
}
