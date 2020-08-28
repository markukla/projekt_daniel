import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "../Models/Post/post.dto";
import PostService from "../RepositoryServices/post.service";
import Post from "../Models/Post/post.entity";
import UserService from "../RepositoryServices/user.service";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";


class UserController implements Controller<User>{
    public path = '/users';
    public router = express.Router();
    public  service:UserService=new UserService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.service.getAllRecords);
        this.router.get(`${this.path}/:id`, this.service.findOneRecord);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CreateUserDto, true), this.service.modifyRecord);
        this.router.delete(`${this.path}/:id`, this.service.deleteRecord);
        // validationMiddleware is attached only to this route
        this.router.post(this.path,validationMiddleware(CreateUserDto), this.service.createNewRecord);
    }


}

export default UserController;