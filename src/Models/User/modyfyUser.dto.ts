import {IsBoolean, IsEmail, IsString} from "class-validator";

class UpdateUserWithouTPasswordDto {
    @IsString()
    fulName: string;

    @IsEmail()
    email: string;

    @IsBoolean()
    active: boolean;

    @IsBoolean()
    isAdmin: boolean;

}
export default UpdateUserWithouTPasswordDto;