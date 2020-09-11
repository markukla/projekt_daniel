import RequestWithUser from "../interfaces/requestWithUser.interface";
import {NextFunction, Response} from "express";
import User from "../Models/Users/user.entity";
import Role from "../Models/Role/role.entity";
import NoEditorPrivilligesException from "../Exceptions/NoEditorPrivilligesException";
import RoleEnum from "../Models/Role/role.enum";

async function editorAuthorizationMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    const user: User = request.user;
    const roles: Role[] = user.roles;
    var isEditor: boolean = false;
    roles.forEach(role => {
        if (role.rolename ===RoleEnum.EDITOR) {
            isEditor = true;
        }
    });
    if (isEditor) {
        next();

    } else {
        next(new NoEditorPrivilligesException());
    }
}

export default editorAuthorizationMiddleware;