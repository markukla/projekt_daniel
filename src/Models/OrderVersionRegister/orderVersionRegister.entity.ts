import {Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Order from "../Order/order.entity";


@Entity("orderVersionRegisters")
class OrderVersionRegister{
    @PrimaryGeneratedColumn()
    id?:number;
    @OneToMany(()=>Order,(order:Order)=>order.orderVersionRegister)
    ordersInthisRegister: Order [];




}
export default OrderVersionRegister;
