import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "../Models/Post/post.dto";
import PostService from "../RepositoryServices/post.service";
import Post from "../Models/Post/post.entity";
import UserService from "../RepositoryServices/user.service";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";
import WrongCredentialsException from "../Exceptions/WrongCredentialsException";
import LogInDto from "../authentication/logIn.dto";
import TokenData from "../interfaces/tokenData.interface";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";


class UserController implements Controller<User>{
    public path = '/users';
    public router = express.Router();
    public  service:UserService=new UserService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware,adminAuthorizationMiddleware,this.service.getAllRecords);
        this.router.get(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.service.findOneRecord);
        this.router.patch(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateUserDto, true), this.service.modifyRecord);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.service.deleteRecord);
        // validationMiddleware is attached only to this route
        this.router.post(this.path,validationMiddleware(CreateUserDto), this.registration);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = request.body;
        try {
            const {
                cookie,
                user,
            } = await this.service.register(userData);
            response.setHeader('Set-Cookie', [cookie]);
            response.send(user);
        } catch (error) {
            next(error);
        }
    }





}

export default UserController;