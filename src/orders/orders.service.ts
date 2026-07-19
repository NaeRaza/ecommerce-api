import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from 'generated/prisma/enums';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}
  async create(
    userId: string,
    items: { productId: number; quantity: number }[],
  ) {
    const productIds = items.map((item) => item.productId);

    const products = await this.prismaService.product.findMany({
      where: { id: { in: productIds } },
    });

    return await this.prismaService.order.create({
      data: {
        userId,
        orderItem: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
              throw new NotFoundException(
                `Produit ${item.productId} introuvable`,
              );
            }
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product?.price,
            };
          }),
        },
      },
      include: { orderItem: true },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.order.findMany({
      where: { userId },
      include: { orderItem: true },
    });
  }

  async findOne(id: string) {
    const orders = await this.prismaService.order.findUnique({
      where: { id },
      include: { orderItem: true },
    });

    const total = orders?.orderItem.reduce(
      (acc, p) => acc + p.price * p.quantity,
      0,
    );

    return {
      ...orders,
      total,
    };
  }
  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prismaService.order.update({
      where: { id },
      data: {
        status,
      },
      include: { user: true },
    });

    const email = order.user.email;

    if (status === OrderStatus.CONFIRMED) {
      await this.mailService.sendOrderConfirmed(email, order.id);
    }

    const {
      user: { password: _, ...orderWithoutPassword },
      ...orderWithoutUser
    } = order;

    return {
      ...orderWithoutUser,
      user: orderWithoutPassword,
    };
  }

  async getHistory(userId: string) {
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      include: { orderItem: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => {
      const total = order.orderItem.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0,
      );
      return { ...order, total };
    });
  }
}
