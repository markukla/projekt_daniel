import HttpException from "./HttpException";

class WeekPasswordException extends HttpException {
    constructor(foultList:string[]) {
        super(500, `password is to week. Password failed due tu:${foultList}`);
    }
}

export default WeekPasswordException;