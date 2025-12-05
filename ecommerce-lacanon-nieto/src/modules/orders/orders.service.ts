import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import { Orders } from './entities/order.entity';
import { Products } from '../products/entity/products.entity';
import { OrderDetails } from './entities/orderDetails.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRespository: Repository<Users>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  async getOrderBy(id: string) {
    try {
      const order = await this.ordersRepository.findOne({
        where: { id },
        relations: {
          orderDetails: {
            products: true,
          },
        },
      });
      if (!order) {
        throw new NotFoundException(`Orden con id ${id} no encontrada`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la orden');
    }
  }

  async addOrder(createOrderDto: CreateOrderDto) {
    try {
      const user: Users | null = await this.usersRespository.findOneBy({
        id: createOrderDto.userId,
      });
      if (!user) {
        throw new NotFoundException(
          `Usuario con id ${createOrderDto.userId} no encontrado`,
        );
      }

      const order = new Orders();
      order.date = new Date();
      order.user = user;

      const newOrder = await this.ordersRepository.save(order);

      let total = 0;

      const productsArray: Products[] = await Promise.all(
        createOrderDto.products.map(async (element) => {
          const product: Products | null =
            await this.productsRepository.findOneBy({
              id: element?.id,
            });
          if (!product) {
            throw new NotFoundException(
              `Producto con id ${element.id} no encontrado`,
            );
          }

          if (product.stock === 0) {
            throw new BadRequestException(
              `Producto "${product.name}" no tiene stock disponible`,
            );
          }

          total += Number(product.price);

          await this.productsRepository.update(
            { id: product.id },
            { stock: product.stock - 1 },
          );
          return product;
        }),
      );

      const orderDetail = new OrderDetails();
      orderDetail.price = Number(total.toFixed(2));
      orderDetail.products = productsArray;
      orderDetail.order = newOrder;

      await this.orderDetailsRepository.save(orderDetail);

      return await this.ordersRepository.find({
        where: { id: newOrder.id },
        relations: { orderDetails: true },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
    }
    throw new InternalServerErrorException('Error al crear la orden');
  }
}
