import HttpException from "./HttpException";

class ProductNotFoundExceptionn extends HttpException{

    constructor(id:string) {


            super(404,`Material with id = ${id} not found`);



    }
}
export default ProductNotFoundExceptionn;