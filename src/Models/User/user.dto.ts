import {Column} from "typeorm";


import {IsArray, IsBoolean, IsEmail, IsNumber, IsString} from "class-validator";
import Role from "../Role/role.entity";



class CreateUserDto {


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

}
export default CreateUserDto;