import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

import { BaseEntity } from '@common/database';

import { Project } from '@modules/projects/entities/project.entity';

import { ActivityStatus } from '../enums/activity-status.enum';

@Entity('activities')
@Index(['status'])
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.PENDING,
  })
  status: ActivityStatus;

  @Column({ type: 'float', default: 0 })
  progress: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @ManyToOne(() => Project, (p) => p.activities, { onDelete: 'CASCADE' })
  project: Project;
}
