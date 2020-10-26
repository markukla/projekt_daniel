import HttpException from "./HttpException";

class ProductTopNotFoundException extends HttpException{

    constructor(id:string) {


        super(404,`ProductTop with id = ${id} not found`);



    }
}
export default ProductTopNotFoundException;
