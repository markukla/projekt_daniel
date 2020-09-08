import {Column} from "typeorm";


import {IsEnum, IsString} from "class-validator";
import RoleEnum from "./role.enum";


class CreateRoleDto {
    @IsEnum(RoleEnum)
    rolename: RoleEnum;


}

export default CreateRoleDto;