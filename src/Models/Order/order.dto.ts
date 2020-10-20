import {IsNumber, IsObject, IsString, Length} from "class-validator";
import OrderDetails from "../OrderDetail/orderDetails.entity";

class CreateOrderDto{



    @IsString()
    partnerId:string;
    @IsString()
    productId:string;
    @IsString()
    materialId:string;
    @IsString()
    creatorId:string
    @IsObject()
    orderDetails:OrderDetails




}
export default CreateOrderDto;