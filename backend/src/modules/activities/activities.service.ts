import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Activity } from './entities/activity.entity';

import { CreateActivityDto, FilterActivityDto, UpdateActivityDto } from './dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,

    private readonly projectsService: ProjectsService,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    const project = await this.projectsService.findOne(
      createActivityDto.projectId,
    );

    const activity = this.activitiesRepository.create({
      ...createActivityDto,
      project,
    });

    return this.activitiesRepository.save(activity);
  }

  async findAll(filter: FilterActivityDto) {
    const { page, limit, sort = 'createdAt', order = 'DESC', status } = filter;

    const where: FindOptionsWhere<Activity> = {};

    if (status) where.status = status;

    const [data, total] = await this.activitiesRepository.findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['project'],
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
    const activity = await this.activitiesRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!activity) throw new NotFoundException('Activity not found');

    return activity;
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    const activity = await this.findOne(id);

    const { projectId, ...updateData } = updateActivityDto;

    if (projectId) {
      const project = await this.projectsService.findOne(projectId);

      activity.project = project;
    }

    Object.assign(activity, updateData);

    return this.activitiesRepository.save(activity);
  }

  async remove(id: string) {
    const activityDelete = await this.activitiesRepository.delete({ id });

    if (activityDelete.affected === 0) {
      throw new NotFoundException('Activity not found');
    }

    return { ok: true };
  }
}
