import RequestWithUser from "../interfaces/requestWithUser.interface";
import {NextFunction, Response} from "express";

import User from "../Models/User/user.entity";

import NoAdminPrivilligesException from "../Exceptions/NoAdminPrivilligesException";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";

async function adminAuthorizationMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
const user=request.user;
const roles :Role[]=user.roles;
var isAdmin:boolean=false;
roles.forEach(role=> {
    if (role.rolename === RoleEnum.ADMIN) {
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