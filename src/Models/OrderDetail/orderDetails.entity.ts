import {Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import WorkingSideEnum from "./workingSideEnum";
import User from "../Users/user.entity";
import Order from "../Order/order.entity";
import Dimension from "./dimension";


@Entity('orderDetails')
class OrderDetails {
    @PrimaryGeneratedColumn()
    public id?:number;

    @Column()
    workingTemperature:number;
    @Column()
    anti_electrostatic:boolean;
    @Column()
    workingSide:WorkingSideEnum;

    @Column({type:"jsonb"})
    dimensions:Dimension[];

@OneToOne(()=>Order,(order:Order)=>order.orderDetails)
    order?:Order;



}
export default OrderDetails;