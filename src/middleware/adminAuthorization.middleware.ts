import RequestWithUser from "../interfaces/requestWithUser.interface";
import {NextFunction, Response} from "express";

import User from "../Models/User/user.entity";

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