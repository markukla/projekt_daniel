import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "../Users/user.entity";
import Product from "../Products/product.entity";
import Material from "../Materials/material.entity";
import OrderDetails from "../OrderDetail/orderDetails.entity";

@Entity('orders')
class Order{

    @PrimaryGeneratedColumn()
    public id?: number;

   @ManyToOne(()=>User,( businessPartner:User)=>businessPartner.ordersAsignedToBusinessPartner)    // has a forein key
    businessPartner:User;

   @ManyToOne(()=>Product,(product:Product)=>product.orders)  // has a forein key
    product:Product;

  @ManyToOne(()=>Material,(productMaterial:Material)=>productMaterial.orders)
    productMaterial:Material;

    @OneToOne(()=>OrderDetails,(orderDetials:OrderDetails)=>orderDetials.)// has a forein key
    @JoinColumn() // this determines that foreing key will be on this side of relation
    orderDetails:OrderDetails;

    @ManyToOne(()=>User,(creator:User)=>creator.ordersCreatedByUser)
    creator:User;  // one user can create many orders so many orders to OneUser (but one this order has only one Creator)=>ManyToOne


}
export default Order;