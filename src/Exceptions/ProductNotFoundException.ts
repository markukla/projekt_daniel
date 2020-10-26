import HttpException from "./HttpException";

class ProductNotFoundExceptionn extends HttpException{

    constructor(id:string) {


            super(404,`Product with id = ${id} not found`);



    }
}
export default ProductNotFoundExceptionn;