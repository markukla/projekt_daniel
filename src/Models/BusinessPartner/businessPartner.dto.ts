import CreateUserDto from "../User/user.dto";
import {IsArray, IsBoolean, IsEmail, IsString} from "class-validator";
import {Column} from "typeorm";
import Role from "../Role/role.entity";

class CreateBusinessPartnerDto {
    @IsString()
    fulName: string;

    @IsEmail()
    email: string;

    @IsString()
    password:string;
    @IsBoolean()
    active: boolean;

    @IsArray()
    roles: Role[];
     @IsString()
    code:string;

    @IsString()
    businesPartnerCompanyName: string;


}
export default CreateBusinessPartnerDto;