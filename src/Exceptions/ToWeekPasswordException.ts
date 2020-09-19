import HttpException from "./HttpException";

class WeekPasswordException extends Error {
    constructor(foultList:string[]) {
        super( `password is to week. Password failed due tu:${foultList}`);
    }
}

export default WeekPasswordException;