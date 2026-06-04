import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';


@Index('IDX_TRACK_TITLE', ['title'])
@Index('IDX_TRACK_ARTIST', ['artist'])
@Index('IDX_TRACK_ISRC', ['isrc'])
@Index('IDX_TRACK_UPC', ['displayUpc'])
@Index('IDX_TRACK_LABEL', ['labelName'])
@Index('IDX_TRACK_RELEASE_Name', ['releaseName'])
@Index('IDX_TRACK_ROW_HASH', ['rowHash'])

@Entity('tracks')
export class Track {

  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ nullable: true })
  isrc!: string;
  
  @Index()
  @Column({ nullable: true })
  title!: string;

  @Index()
  @Column({ nullable: true })
  artist!: string;

  @Column({ nullable: true })
  recordingArtist!: string;

  @Column({ nullable: true })
  genre!: string;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  bpm!: number;

  @Column({ nullable: true })
  trackDuration!: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  trackNo!: number;

  @Index()
  @Column({ nullable: true })
  labelName!: string;

  @Index()
  @Column({ nullable: true })
  releaseName!: string;

  @Column({ nullable: true })
  releaseDate!: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  volumeNo!: number;

  @Column({ nullable: true })
  language!: string;

  @Column({ nullable: true })
  producer!: string;

  @Column({ nullable: true })
  publisher!: string;

  @Column({ nullable: true })
  writer!: string;

  @Column({ nullable: true })
  pLine!: string;

  @Column({ nullable: true })
  cLine!: string;

  @Index()
  @Column({ nullable: true })
  displayUpc!: string;

  @Column({ default: false })
  isDeleted!: boolean;

  // 🔥 NEW
  @Index({ unique: true })
  @Column({ type: 'text' })
  rowHash!: string;
}

