import RequestWithUser from "../interfaces/requestWithUser.interface";
import {NextFunction, Response} from "express";
import {getRepository} from "typeorm";
import User from "../Models/User/user.entity";
import * as jwt from "jsonwebtoken";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import WrongAuthenticationTokenException from "../Exceptions/WrongAuthenticationTokenException";
import AuthenticationTokenMissingException from "../Exceptions/AuthenticationTokenMissingException";
import UserService from "../RepositoryServices/user.service";
import NoAdminPrivilligesException from "../Exceptions/NoAdminPrivilligesException";
import Role from "../Models/Role/role.entity";

async function adminAuthorizationMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
const user:User=request.user;
const roles :Role[]=user.roles;
var isAdmin:boolean=false;
roles.forEach(role=> {
    if (role.rolename === 'admin') {
        isAdmin = true;
    }
});
    if(isAdmin){
        next();

    }
    else {
        next(new NoAdminPrivilligesException());
    }
}






export default adminAuthorizationMiddleware;