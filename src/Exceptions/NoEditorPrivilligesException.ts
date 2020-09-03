import HttpException from "./HttpException";

class NoEditorPrivilligesException extends HttpException {
    constructor() {
        super(401, 'You cannot access this area, because of no editor privilliges');
    }
}

export default NoEditorPrivilligesException;
