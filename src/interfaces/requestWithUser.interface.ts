import { Request } from 'express';
import User from "../Models/User/user.entity";

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
