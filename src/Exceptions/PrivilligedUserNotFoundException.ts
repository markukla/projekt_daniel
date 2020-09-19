import HttpException from "./HttpException";

class PrivilligedUserNotFoundException extends HttpException{

    constructor(id:string) {
        super(404,`Privilliged User with id ${id} not found`);
    }
}
export default PrivilligedUserNotFoundException;