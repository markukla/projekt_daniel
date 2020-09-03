import { IsString } from 'class-validator';

class ChangePasswordDto {
    @IsString()
    public oldPassword: string;

    @IsString()
    public newPassword: string;
}

export default ChangePasswordDto;