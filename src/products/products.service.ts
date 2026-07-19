import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: QueryProductDto) {
    // Étape 1 — Extraire page, limit, search, minPrice, maxPrice, categoryId du query
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      categoryId,
    } = query;

    // Étape 2 — Construire l'objet where avec les filtres
    //           search → { name: { contains: search, mode: 'insensitive' } }
    //           minPrice → { price: { gte: minPrice } }
    //           maxPrice → { price: { lte: maxPrice } }
    //           categoryId → { categoryId }

    const where = {
      ...(search && {
        name: { contains: search, mode: 'insensitive' as const },
      }),
      ...(minPrice && { price: { gte: minPrice } }),
      ...(maxPrice && { price: { lte: maxPrice } }),
      ...(categoryId && { categoryId }),
    };

    const products = await this.prismaService.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
    });

    // Étape 3 — Compter le total avec prisma.product.count({ where })
    const total = await this.prismaService.product.count({
      where,
    });

    // Étape 4 — Récupérer les produits avec skip et take
    //           skip = (page - 1) * limit
    //           take = limit

    // Étape 5 — Retourner { data, total, page, limit, totalPages }
    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Produit ${id} introuvable`);
    }
    return product;
  }

  async create(name: string, price: number, categoryId: number) {
    const product = await this.prismaService.product.create({
      data: {
        name,
        price,
        categoryId,
      },
      include: { category: true },
    });
    return product;
  }

  async update(id: number, name?: string, price?: number) {
    const product = await this.prismaService.product.update({
      where: { id },
      data: {
        name,
        price,
      },
    });
    return product;
  }

  async remove(id: number) {
    await this.prismaService.product.delete({
      where: { id },
    });
  }
}
