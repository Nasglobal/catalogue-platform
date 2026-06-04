import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  userEmail!: string;

  @Column()
  action!: string;

  @Column({
    nullable: true,
  })
  resource!: string;

  @Column({
    nullable: true,
  })
  resourceId!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata: any;

  @Column({
    nullable: true,
  })
  ipAddress!: string;

  @CreateDateColumn()
  createdAt!: Date;
}