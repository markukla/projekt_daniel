import HttpException from "./HttpException";

class IncorrectPaswordException extends HttpException {
    constructor() {
        super(401, 'password is incorrect');
    }
}

export default IncorrectPaswordException;
