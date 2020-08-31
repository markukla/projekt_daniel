import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';

import User from "../Models/User/user.entity";
import UserService from "../RepositoryServices/user.service";
import LogInDto from "./logIn.dto";
import WrongCredentialsException from "../Exceptions/WrongCredentialsException";

class AuthenticationController implements Controller<User> {
  public path = '/auth';
  public router = express.Router();
 public service = new UserService()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LogInDto = request.body;
    try{ const {
      loggedUser,
      tokenData
    } =await this.service.login(logInData);

      if(loggedUser!=null){

        response.setHeader('Set-Cookie', [this.service.createCookie(tokenData)]);
        response.send(loggedUser);
      } else {
        next(new WrongCredentialsException());
      }

    }
    catch (error) {
      next(error);

    }
  }


}
export default AuthenticationController;
