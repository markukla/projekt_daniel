import HttpException from "./HttpException";

class NoAdminPrivilligesException extends HttpException {
    constructor() {
        super(401, 'You cannot access this area, because of no admin privilliges');
    }
}

export default NoAdminPrivilligesException;
