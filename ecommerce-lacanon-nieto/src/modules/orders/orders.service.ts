import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
    try {
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
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
    }
    throw new InternalServerErrorException('Error al crear la orden');
  }

  async getOrder(id: string) {
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

  async findAll() {
    // getOrders
    try {
      const orders = await this.ordersRepository.find({
        relations: {
          orderDetails: {
            products: true,
          },
          user: true, // para ver el usuario que hizo la orden
        },
      });
      return orders;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las ordenes');
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.ordersRepository.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException(`Order con id ${id} no existe`);
      }
      // Si se está cancelando, devolver el stock
      if (
        updateOrderDto.status === 'cancelled' &&
        order.status !== 'cancelled'
      ) {
        await this.restoreStock(id);
      }

      // Actualizar el estado
      const result = await this.ordersRepository.update(id, updateOrderDto);

      if (result.affected === 0) {
        throw new NotFoundException(`Orden con id ${id} no existe`);
      }

      // Retornar la orden actualizada
      return await this.ordersRepository.findOne({
        where: { id },
        relations: {
          orderDetails: {
            products: true,
          },
          user: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new ConflictException('Error al actualizar la orden');
      }
      throw new InternalServerErrorException('Error al actualizar la orden');
    }
  }

  // Método auxiliar para devolver stock cuando se cancela
  private async restoreStock(orderId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });

    if (order?.orderDetails) {
      for (const product of order.orderDetails.products) {
        await this.productsRepository.update(
          { id: product.id },
          { stock: product.stock + 1 },
        );
      }
    }
  }

  async remove(id: string) {
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
        throw new NotFoundException(`Orden con id ${id} no existe`);
      }

      // Devolver el stock antes de eliminar
      if (order.orderDetails?.products) {
        for (const product of order.orderDetails.products) {
          await this.productsRepository.update(
            { id: product.id },
            { stock: product.stock + 1 },
          );
        }
      }

      // Eliminar la orden (también elimina orderDetails por cascade)
      const result = await this.ordersRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Orden con id ${id} no existe`);
      }

      return { message: `Orden con id ${id} eliminada correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Error de FK constraint
      if (error.code === '23503') {
        throw new ConflictException(
          'No se puede eliminar la orden porque tiene relaciones asociadas',
        );
      }
      throw new InternalServerErrorException('Error al eliminar la orden');
    }
  }
}
