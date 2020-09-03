import { Request } from 'express';
import User from "../Models/User/user.entity";
import BusinesPartner from "../Models/BusinessPartner/businesPartner.entity";

interface RequestWithUser extends Request {
  user: User|BusinesPartner;
}

export default RequestWithUser;
