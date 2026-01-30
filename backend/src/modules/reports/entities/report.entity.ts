import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '@modules/projects/entities/project.entity';

import { BaseEntity } from '@common/database';

@Entity('reports')
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (p) => p.reports, { onDelete: 'CASCADE' })
  project: Project;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  generatedBy: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
