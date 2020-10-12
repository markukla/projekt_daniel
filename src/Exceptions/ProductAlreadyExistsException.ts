import HttpException from "./HttpException";


class ProductAlreadyExistsException extends HttpException {
    constructor() {
      super(400,"Product which you are trying to add Already exist in databae");

    }
}

export default ProductAlreadyExistsException;
