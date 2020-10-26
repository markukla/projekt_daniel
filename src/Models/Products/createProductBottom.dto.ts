import {IsString, Length} from "class-validator";
import {Column} from "typeorm";

//this class represents fields filled by the user, oter fields like url addresses will be obtained in other way
class CreateProductBottomDto{



    @IsString()
    productBottomType:string;
    @IsString()
    productBottomCode:string;







}
export default CreateProductBottomDto;
