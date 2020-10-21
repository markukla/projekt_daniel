import {Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Order from "../Order/order.entity";


@Entity("orderVersionRegisters")
class OrderVersionRegister{
    @PrimaryGeneratedColumn()
    id?:number;
    @OneToMany(()=>Order,(order:Order)=>order.orderVersionRegister)
    orders: Order []




}
export default OrderVersionRegister;