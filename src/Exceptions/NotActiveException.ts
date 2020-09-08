import HttpException from "./HttpException";

class NotActiveException extends HttpException {
    constructor() {
        super(401, 'your account is inactive, contact with admin to regain active status');
    }
}

export default NotActiveException;
