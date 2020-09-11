import CreatePrivilegedUserDto from "../PrivilegedUsers/user.dto";
import {IsArray, IsBoolean, IsEmail, IsString} from "class-validator";

import Role from "../../Role/role.entity";

class CreateBusinessPartnerDto  {
    @IsString()
    fulName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
    @IsBoolean()
    active: boolean;

    @IsString()
    code: string;

    @IsString()
    businesPartnerCompanyName: string;


}

export default CreateBusinessPartnerDto;