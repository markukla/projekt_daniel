import User from "../Models/User/user.entity";
import TokenData from "../interfaces/tokenData.interface";
import BusinesPartner from "../Models/BusinessPartner/businesPartner.entity";

class LoggedUser {
    user:User|BusinesPartner;
    tokenData:TokenData;


    constructor(user: User|BusinesPartner, tokenData: TokenData) {
        this.user = user;
        this.tokenData = tokenData;
    }
}
export default LoggedUser;