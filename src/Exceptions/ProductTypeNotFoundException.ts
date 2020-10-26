import HttpException from "./HttpException";

class ProductTypeNotFoundException extends HttpException{

    constructor(id:string) {


        super(404,` ProductType with id = ${id} not found`);



    }
}
export default ProductTypeNotFoundException;
