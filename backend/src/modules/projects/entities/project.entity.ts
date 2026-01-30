import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@common/database';

import { Activity } from '@modules/activities/entities/activity.entity';
import { Indicator } from '@modules/indicators/entities/indicator.entity';
import { Report } from '@modules/reports/entities/report.entity';

import { ProjectStatus } from '../enums/project-status.enum';

@Entity('projects')
@Index(['status'])
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @Column({ type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'float', default: 0 })
  progress: number;

  @Column({ type: 'float', default: 0 })
  performance: number;

  @OneToMany(() => Activity, (a) => a.project, { cascade: true })
  activities: Activity[];

  @OneToMany(() => Indicator, (i) => i.project, { cascade: true })
  indicators: Indicator[];

  @OneToMany(() => Report, (r) => r.project, { cascade: true })
  reports: Report[];
}
