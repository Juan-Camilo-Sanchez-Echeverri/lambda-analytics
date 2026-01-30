import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

import { BaseEntity } from '@common/database';

import { Project } from '@modules/projects/entities/project.entity';

@Entity('indicators')
@Index(['name'])
export class Indicator extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (p) => p.indicators, { onDelete: 'CASCADE' })
  project: Project;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'float', default: 0 })
  currentValue: number;

  @Column({ type: 'float', default: 0 })
  threshold: number;

  @Column({ length: 50, nullable: true })
  unit?: string;
}
