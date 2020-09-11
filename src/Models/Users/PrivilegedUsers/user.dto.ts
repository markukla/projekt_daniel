import {Column} from "typeorm";


import {IsArray, IsBoolean, IsEmail, IsNumber, IsString} from "class-validator";
import Role from "../../Role/role.entity";


class CreatePrivilegedUserDto {


    @IsString()
    fulName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
    @IsBoolean()
    active: boolean;

    @IsBoolean()
    isAdmin: boolean;

}

export default CreatePrivilegedUserDto;



