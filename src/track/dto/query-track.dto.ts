import {
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';

export class QueryTrackDto {

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  artist?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  isrc?: string;

  @IsOptional()
  @IsString()
  displayUpc?: string;

  @IsOptional()
  @IsString()
  labelName?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: string;
}