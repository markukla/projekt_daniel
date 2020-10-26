import HttpException from "./HttpException";

class OrderNotFoundException extends HttpException{


    constructor(id:string) {
        super(404,`Order with id= ${id} not found`);
    }
}
export default OrderNotFoundException;