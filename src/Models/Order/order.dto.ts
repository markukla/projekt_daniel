import {IsNumber, IsObject, IsString, Length} from "class-validator";
import OrderDetails from "../OrderDetail/orderDetails.entity";
import {Column} from "typeorm";

class CreateOrderDto{



    @IsString()
    partnerId:string;
    @IsString()
    productId:string;
    @IsString()
    materialId:string;
    @IsString()
    creatorId:string
    @IsObject()  // it would be good to check if it is instance of Orderdetails, but @IsInstance, does not work properly,
    orderDetails:OrderDetails

    @IsNumber()
    orderNumber:number;
    @IsString()
    orderVersionNumber:string;
    @IsString()
    orderTotalNumber:string // orderNumber and version number with some separator
    @IsString()
    index:string;

    @IsString()
    data:string;
    @IsString()
    orderName:string;


}
export default CreateOrderDto;