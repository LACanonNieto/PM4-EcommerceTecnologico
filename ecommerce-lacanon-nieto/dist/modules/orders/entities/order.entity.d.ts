import { Users } from 'src/modules/users/entity/users.entity';
import { OrderDetails } from './orderDetails.entity';
export declare class Orders {
    id: string;
    date: Date;
    user: Users;
    orderDetails: OrderDetails;
}
