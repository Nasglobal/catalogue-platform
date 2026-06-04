import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';


@Index('IDX_ALBUM_TITLE', ['title'])
@Index('IDX_ALBUM_ARTIST', ['artist'])
@Index('IDX_ALBUM_ISRC', ['isrc'])
@Index('IDX_ALBUM_RELEASE_NAME', ['releaseName'])
@Index('IDX_ALBUM_UPC', ['displayUpc'])
@Index('IDX_ALBUM_VENDOR', ['vendorName'])
@Index('IDX_ALBUM_LABEL', ['labelName'])
@Index('IDX_ALBUM_ROW_HASH', ['rowHash'])
@Entity('albums')

@Entity('albums')
export class Album {

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

  @Index()
  @Column({ nullable: true })
  displayUpc!: string;

  @Index()
  @Column({ nullable: true })
  releaseName!: string;

  @Column({ nullable: true })
  releaseDate!: string;

  @Index()
  @Column({ nullable: true })
  labelName!: string;

  @Column({ nullable: true })
  vendorName!: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  totalTracks!: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  totalVolumes!: number;

  @Column({ nullable: true })
  priceBand!: string;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  wholesalePrice!: number;

  @Column({ nullable: true })
  territories!: string;

  @Column({ default: false })
  isDeleted!: boolean;

  // 🔥 NEW
  @Index({ unique: true })
  @Column({ type: 'text' })
  rowHash!: string;
}