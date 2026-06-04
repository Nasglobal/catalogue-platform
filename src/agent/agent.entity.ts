import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Index('IDX_AGENT_LABEL_NAME', ['labelNamePkt'])

@Entity('agents')
export class Agent {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
  unique: true,
  })
  zkp_Label!: string;

  @Index()
  @Column({
    nullable: true,
  })
  labelNamePkt!: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  labelRoyaltyRate!: number;

  @Column({
    nullable: true,
  })
  currencyPreferred!: string;

  @Column({
    nullable: true,
  })
  labelStatus!: string;

  @Column({
    nullable: true,
  })
  contractStartDate!: string;

  @Column({
    nullable: true,
  })
  contractEndDate!: string;

  @Column({
    nullable: true,
  })
  nameFirst!: string;

  @Column({
    nullable: true,
  })
  nameLast!: string;

  @Column({
    nullable: true,
  })
  email1!: string;

  @Column({
    nullable: true,
  })
  email2!: string;

  @Column({
    nullable: true,
  })
  email3!: string;

  @Column({
    nullable: true,
  })
  labelPhone!: string;

  @Column({
    nullable: true,
  })
  addressLine1!: string;

  @Column({
    nullable: true,
  })
  addressCityState!: string;

  @Column({
    nullable: true,
  })
  addressCountry!: string;

  @Column({
    nullable: true,
  })
  addressZipCode!: string;
}