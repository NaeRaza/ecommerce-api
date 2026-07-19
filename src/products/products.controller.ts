import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { QueryProductDto } from './dto/query-product.dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  // Étape 1 — Injecte le ProductsService dans le constructor
  constructor(private readonly productsService: ProductsService) {}
  // Étape 2 — GET /products : retourne tous les produits
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }
  // Étape 3 — GET /products/:id : retourne un produit par son id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(Number(id));
  }
  // Étape 4 — POST /products : crée un produit

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() { name, price, categoryId }: CreateProductDto) {
    return this.productsService.create(name, price, categoryId);
  }
  // Étape 5 — PATCH /products/:id : modifier un produit

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Body() { name, price }: UpdateProductDto, @Param('id') id: number) {
    return this.productsService.update(Number(id), name, price);
  }
  // Étape 6 — DELETE /products/:id : supprime un produit

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(Number(id));
  }
}
