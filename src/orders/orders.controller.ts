import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'generated/prisma/enums';

@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.ADMIN, Role.CLIENT)
  @Post()
  async create(@Request() req, @Body() dto: CreateOrderDto) {
    return await this.ordersService.create(req.user.id, dto.items);
  }

  @Roles(Role.ADMIN, Role.CLIENT)
  @Get()
  async findAll(@Request() req) {
    return await this.ordersService.findAll(req.user.id);
  }

  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('history')
  async getHistory(@Request() req) {
    return await this.ordersService.getHistory(req.user.id);
  }

  @Roles(Role.ADMIN, Role.CLIENT)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return await this.ordersService.updateStatus(id, dto.status);
  }
}
