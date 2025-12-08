import { Users } from 'src/modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetails } from './orderDetails.entity';

@Entity({
  name: 'ORDERS',
})
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @ManyToOne(() => Users, (user) => user.order)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_detail_id' })
  orderDetails: OrderDetails;
}
