import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('uploads')
export class Upload {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  filename!: string;

  @Column({
    default: 'processing',
  })
  status!: string;

  @Column({
    type: 'bigint',
    default: 0,
  })
  processedRows!: number;

  @Column({
    type: 'bigint',
    default: 0,
  })
  insertedTracks!: number;

  @Column({
    type: 'bigint',
    default: 0,
  })
  insertedAlbums!: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  error!: string;

  @CreateDateColumn()
  createdAt!: Date;
}