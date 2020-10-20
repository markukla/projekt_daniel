import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "../Users/user.entity";
import Product from "../Products/product.entity";
import Material from "../Materials/material.entity";
import OrderDetails from "../OrderDetail/orderDetails.entity";

@Entity("orders")
class Order{

    @PrimaryGeneratedColumn()
    public id?: number;

   @ManyToOne(()=>User,( businessPartner:User)=>businessPartner.ordersWhichPointThisUserAsBusinessPartner,{eager:true})    // has a forein key
    businessPartner:User;

   @ManyToOne(()=>Product,{eager:true})  // has a forein key
    product:Product;

  @ManyToOne(()=>Material,(productMaterial:Material)=>productMaterial.orders,{eager:true})
    productMaterial:Material;

    @OneToOne(()=>OrderDetails,{eager:true,cascade:true})// has a forein key
    @JoinColumn() // this determines that foreing key will be on this side of relation
    orderDetails:OrderDetails;
    @ManyToOne(()=>User,(creator:User)=>creator.ordersCreatedByThisUser,{eager:true})
    creator:User



}
export default Order;