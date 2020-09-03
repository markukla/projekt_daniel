import User from "../Models/User/user.entity";
import TokenData from "../interfaces/tokenData.interface";

class LoggedUser {
    user:User;
    tokenData:TokenData;


    constructor(user: User, tokenData: TokenData) {
        this.user = user;
        this.tokenData = tokenData;
    }
}
export default LoggedUser;