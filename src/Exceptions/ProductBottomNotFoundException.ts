import HttpException from "./HttpException";

class ProductBottomNotFoundException extends HttpException{

    constructor(id:string) {


        super(404,`ProductBottom with id = ${id} not found`);



    }
}
export default ProductBottomNotFoundException;
