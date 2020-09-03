import HttpException from "./HttpException";


class UserWithThisEmailDoesNotExistException extends HttpException {
    constructor(email: string) {
        super(400, `User with email ${email} does not exists`);
    }
}

export default UserWithThisEmailDoesNotExistException;
