import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  /**
   * Creation date of the entity.
   * Automatically generated when the entity is created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Last update date of the entity.
   * Automatically updated when the entity is modified.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
