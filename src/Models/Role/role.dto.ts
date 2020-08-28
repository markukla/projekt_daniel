import {Column} from "typeorm";


import {IsString} from "class-validator";


class CreateRoleDto {
    @IsString()
    rolename: string;

    @IsString()
    roleDescription: string;

}
export default CreateRoleDto;