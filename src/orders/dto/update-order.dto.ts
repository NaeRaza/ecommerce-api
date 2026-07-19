import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'generated/prisma/enums';

export class UpdateOrderDto {
  @ApiProperty({ example: 'CONFIRMED' })
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
