import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.category.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.category.findUnique({
      where: { id },
    });
  }

  async create(name: string) {
    return await this.prismaService.category.create({
      data: { name },
    });
  }

  async delete(id: number) {
    return await this.prismaService.category.delete({
      where: { id },
    });
  }
}
