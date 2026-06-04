import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('api_keys')
export class ApiKey {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  keyHash!: string;

  @Column()
  appName!: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column({
    nullable: true,
  })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;
}