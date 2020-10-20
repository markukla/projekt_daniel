import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import WorkingSideEnum from "./workingSideEnum";
import User from "../Users/user.entity";
import Order from "../Order/order.entity";


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
    @Column()
    orderNumber:number;
    @Column()
    orderVersionNumber:number;
    @Column()
    orderTotalNumber:String // orderNumber and version number with some separator
    @Column()
    index:string;

    @Column()
    data:string;
    @Column()
    orderName:String;





}
export default OrderDetails;