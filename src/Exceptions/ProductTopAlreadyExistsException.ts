import HttpException from "./HttpException";


class ProductTopAlreadyExistsException extends HttpException {
    constructor() {
        super(400,"ProductTop which you are trying to add Already exist in database");

    }
}

export default ProductTopAlreadyExistsException;
