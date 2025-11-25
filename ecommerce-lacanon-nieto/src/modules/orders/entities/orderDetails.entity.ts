import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './order.entity';
import { Products } from 'src/modules/products/entity/products.entity';

@Entity({
  name: 'ORDERDETAILS',
})
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @OneToOne(() => Orders, (order) => order.orderDetails)
  order: Orders;

  @ManyToMany(() => Products)
  @JoinTable({
    name: 'ORDER_DETAILS_PRODUCTS',
  })
  products: Products[];
}
