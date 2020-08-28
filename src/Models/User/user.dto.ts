import {Column} from "typeorm";


import {IsArray, IsBoolean, IsEmail, IsString} from "class-validator";
import Role from "../Role/role.entity";
import {classToClass} from "class-transformer";


class CreateUserDto {
   @IsString()
    name: string;

    @IsString()
    lastname:string;

   @IsEmail()
    email: string;

   @IsString()
   password:string;
    @IsBoolean()
    isactive: boolean;

   @IsArray()
    roles: Role[];

}
export default CreateUserDto;