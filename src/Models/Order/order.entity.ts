import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "../Users/user.entity";
import Product from "../Products/product.entity";
import Material from "../Materials/material.entity";
import OrderDetails from "../OrderDetail/orderDetails.entity";
import OrderVersionRegister from "../OrderVersionRegister/orderVersionRegister.entity";

@Entity("orders")
class Order {

    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    orderNumber:number;  // it is not id because it is the same for orders with the same order version register
    @Column()
    orderVersionNumber:string;
    @Column()
    orderTotalNumber:String // orderNumber and version number with some separator
    @Column()
    index:string;

    @Column()
    data:string;
    @Column()
    orderName:string;

    @Column({nullable:true})
    commentToOrder?:string;

    @ManyToOne(() => User, (businessPartner: User) => businessPartner.ordersWhichPointThisUserAsBusinessPartner, {eager: true})    // has a forein key
    businessPartner: User;

    @ManyToOne(() => Product, {eager: true})  // has a forein key
    product: Product;

    @ManyToOne(() => Material, (productMaterial: Material) => productMaterial.orders, {eager: true})
    productMaterial: Material;

    @OneToOne(() => OrderDetails, {eager: true, cascade:true,onDelete:"CASCADE"})// has a forein key
    @JoinColumn() // this determines that foreing key will be on this side of relation
    orderDetails: OrderDetails;
    @ManyToOne(() => User, (creator: User) => creator.ordersCreatedByThisUser, {eager: true})
    creator: User

@ManyToOne(()=>OrderVersionRegister,(orderVersionRegister:OrderVersionRegister)=>orderVersionRegister.orders,{eager: true,cascade:true})
    orderVersionRegister:OrderVersionRegister;



}

export default Order;
