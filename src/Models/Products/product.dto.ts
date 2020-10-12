import {IsString, Length} from "class-validator";
import {Column} from "typeorm";

//this class represents fields filled by the user, oter fields like url addresses will be obtained in other way
class CreateProductDto{



    @IsString()
    productType:string;
    @IsString()
    productCode:string;

    @IsString()
    productTopType:string;

    @IsString()
    productTopCode:string;

    @IsString()
    productBottomType:string;

    @IsString()
    productBottomCode:string;

    @IsString()
    dimensionsCodes:string;


}
export default CreateProductDto;