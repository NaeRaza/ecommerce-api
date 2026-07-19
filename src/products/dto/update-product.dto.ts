import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Iphone 15' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}
