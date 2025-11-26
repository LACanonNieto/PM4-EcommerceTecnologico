import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
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

  async addOrder(createOrderDto: CreateOrderDto) {
    //buscar el usuario
    const user: Users | null = await this.usersRespository.findOneBy({
      id: createOrderDto.userId,
    });
    if (!user) {
      throw new NotFoundException(
        `Usuario con id ${createOrderDto.userId} no encontrado`,
      );
    }
    //se crea la orden
    const order = new Orders();
    order.date = new Date();
    order.user = user;

    const newOrder = await this.ordersRepository.save(order);

    let total = 0;
    // Buscar productos y validar el stock
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

        // VALIDAR STOCK si esta en 0 y no mostrarlos
        if (product.stock === 0) {
          throw new BadRequestException(
            `Producto "${product.name}" no tiene stock disponible`,
          );
        }

        total += Number(product.price);
        //REDUCIR EL STOCK
        await this.productsRepository.update(
          { id: product.id },
          { stock: product.stock - 1 },
        );
        return product; //retorna el producto como objeto para crear el deatlle de compra
      }),
    );
    // CREA DETALLE DE LA ORDEN
    const orderDetail = new OrderDetails();
    orderDetail.price = Number(total.toFixed(2)); // decimal
    orderDetail.products = productsArray; //aca los productos ya no son por id si no un arreglo con los productos
    orderDetail.order = newOrder;

    await this.orderDetailsRepository.save(orderDetail); //debo guardarla en la base de datos con save, porque si no solo queda local

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: { orderDetails: true },
    }); //aca ya lo que genera es la orden de compra y el detalle como lo indica solo como una relacion
  }

  async findOne(id: string) {
    const order: Orders | null = await this.ordersRepository.findOne({
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
  }

  findAll() {
    return `This action returns all orders`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
