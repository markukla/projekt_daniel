import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "../Models/Post/post.dto";
import PostService from "../RepositoryServices/post.service";
import Post from "../Models/Post/post.entity";
import UserService from "../RepositoryServices/user.service";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";
import RoleService from "../RepositoryServices/role.service";
import Role from "../Models/Role/role.entity";
import CreateRoleDto from "../Models/Role/role.dto";


class RoleController implements Controller<Role>{
    public path = '/roles';
    public router = express.Router();
    public  service:RoleService=new RoleService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.service.getAllRecords);
        this.router.get(`${this.path}/:id`, this.service.findOneRecord);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CreateRoleDto, true), this.service.modifyRecord);
        this.router.delete(`${this.path}/:id`, this.service.deleteRecord);
        // validationMiddleware is attached only to this route
        this.router.post(this.path,validationMiddleware(CreateRoleDto), this.service.createNewRecord);
    }


}

export default RoleController;