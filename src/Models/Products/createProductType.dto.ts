import {IsArray, IsObject, IsString, Length} from "class-validator";
import {Column} from "typeorm";
import ProductTop from "./productTop.entity";
import ProductBottom from "./productBottom.entity";

//this class represents fields filled by the user, oter fields like url addresses will be obtained in other way
class CreateProductTypeDto{



    @IsString()
    productTypeName:string;
    @IsString()
    productTypeCode:string;
    @IsArray()
    productTopsAvailableToThisProductType:ProductTop[];  // insteed of using whole objects we nan use id of each product type eg [{"id"=1},{"id=2"}]
    @IsArray()
    productBottomsAvailableToThisProductType:ProductBottom[];






}
export default CreateProductTypeDto;
