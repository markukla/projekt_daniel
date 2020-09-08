import {IsBoolean, IsEmail, IsString} from "class-validator";

class UpdateBussinessPartnerWithoutPassword  {
    @IsString()
    fulName: string;
    @IsEmail()
    email: string;
    @IsBoolean()
    active: boolean;
    @IsString()
    code: string;
    @IsString()
    businesPartnerCompanyName: string;


}
export default UpdateBussinessPartnerWithoutPassword;