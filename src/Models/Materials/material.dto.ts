import {IsString, Length} from "class-validator";

class CreateMaterialDto{


    @Length(6 ,6)
    @IsString()
    materialCode:string;
    @IsString()
    materialName:string;


}
export default CreateMaterialDto;