import {IsNumber, IsObject, IsString, Length} from "class-validator";
import OrderDetails from "../OrderDetail/orderDetails.entity";
import {Column} from "typeorm";
import User from "../Users/user.entity";
import Product from "../Products/product.entity";
import Material from "../Materials/material.entity";

class CreateOrderDto{



    @IsObject()
    businessPartner:User;  // when is object is used it can be object with all properties set, but also object with only id set, because only id is save as foreign key in database
    @IsObject()
    product:Product;
    @IsObject()
    productMaterial:Material;
    @IsObject()
    creator:User;
    @IsObject()  // it would be good to check if it is instance of Orderdetails, but @IsInstance, does not work properly,
    orderDetails:OrderDetails;
    @IsString()
    index:string;

    @IsString()
    orderName:string;
    @IsString()
    commentToOrder:string;


}
export default CreateOrderDto;
