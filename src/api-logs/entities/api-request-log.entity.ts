import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('api_request_logs')
export class ApiRequestLog {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  apiKeyId!: number;

  @Column()
  appName!: string;

  @Column()
  method!: string;

  @Column()
  endpoint!: string;

  @Column()
  statusCode!: number;

  @Column({
    nullable: true,
  })
  ipAddress!: string;

  @Column({
    nullable: true,
  })
  responseTime!: number;

  @CreateDateColumn()
  createdAt!: Date;
}