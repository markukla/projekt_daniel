import {IsObject, IsString, Length} from "class-validator";
import {Column} from "typeorm";
import ProductType from "./productType.entity";
import ProductTop from "./productTop.entity";
import ProductBottom from "./productBottom.entity";

//this class represents fields filled by the user, oter fields like url addresses will be obtained in other way
class CreateProductDto{



    @IsObject()
    productType:ProductType;

    @IsObject()
    productTop:ProductTop;

    @IsObject()
    productBottom:ProductBottom;

    @IsObject()
    dimensionsCodes:string;



}
export default CreateProductDto;
