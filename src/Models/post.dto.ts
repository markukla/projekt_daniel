
// @ts-ignore
import {IsString} from "class-validator";


class CreatePostDto {
    @IsString()
    public author:string;
    public content:string;
    public title:string;

}
export default CreatePostDto;