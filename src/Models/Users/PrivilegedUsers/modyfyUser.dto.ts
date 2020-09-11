import {IsBoolean, IsEmail, IsString} from "class-validator";

class UpdatePrivilegedUserWithouTPasswordDto {
    @IsString()
    fulName: string;

    @IsEmail()
    email: string;

    @IsBoolean()
    active: boolean;

    @IsBoolean()
    isAdmin: boolean;

}
export default UpdatePrivilegedUserWithouTPasswordDto;