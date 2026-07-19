import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Iphone 15' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;
}
