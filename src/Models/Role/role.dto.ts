import {Column} from "typeorm";


import {IsString} from "class-validator";


class CreateRoleDto {
    @IsString()
    rolename: string;



}
export default CreateRoleDto;