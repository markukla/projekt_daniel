import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";


import User from "../Models/Users/user.entity";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";

import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import UserService from "../RepositoryServices/userRepositoryService";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import ChangePasswordDto from "../authentication/changePassword.dto";
import UpdatePrivilegedUserWithouTPasswordDto from "../Models/Users/PrivilegedUsers/modyfyUser.dto";



class UserController implements Controller<User>{
    public path = '/users';
    public router = express.Router();
    public  service:UserService=new UserService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware,adminAuthorizationMiddleware,this.getAllUsers);
        this.router.get(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.getOneUserById);
        this.router.patch(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreatePrivilegedUserDto, true), this.updateUserById);
        this.router.patch(`${this.path}/:id/changePassword`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(ChangePasswordDto, true), this.changePasswordByAdmin);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneUserById);
        this.router.post(this.path,validationMiddleware(CreatePrivilegedUserDto), this.registerOneUser);
    }

    private registerOneUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: CreatePrivilegedUserDto = request.body;
        try {
            const user = await this.service.registerPrivilegedUser(userData);

            response.send(user);
        } catch (error) {
            next(error);
        }
    }


private updateUserById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const userData:UpdatePrivilegedUserWithouTPasswordDto=request.body;
        const id:number=Number(request.params.id);
        try {
            const modyfiedUser = await this.service.updatePrivilegedUserWithoutPasssword(id, userData);
if(modyfiedUser){
    response.send(modyfiedUser)}
else {next(new UserNotFoundException(String(id)));

}
        }
        catch (error) {
            next(error);
            }

        }

private getAllUsers = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
{
try{
    const users:User[]=await this.service.getAllPrivilegedUsers();

    /*
    one way to hide information which sholul be removed from final endpoint:
    users.forEach(user=>{
        user.code=undefined;
        user.businesPartnerCompanyName=undefined;
        user.roles=undefined;
        user.id=undefined;
        user.password=undefined;
    });
*/
    response.send(users);


}
catch (error) {
    next(error);
}


}

private getOneUserById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
const id:string=request.params.id;
        try{
    const foundUser=await this.service.findOnePrivilegedUserById(id);
    if(foundUser){
        response.send(foundUser)
    }
    else {
       next(new UserNotFoundException(String(id))) ;
    }
}
        catch (error) {
            next(error);
        }



}
    private deleteOneUserById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:number=Number(request.params.id);
        try{
            const deleTedResponse=await this.service.deletePrivilegedUserById(id);
            if(deleTedResponse.affected===1){
                response.send({
                    status:200,
                    message:`user with id= ${id} has beeen removed`
                })
            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }

    }

    private changePasswordByAdmin = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{

        try{
            const id:string=request.params.id;
            const user=await this.service.findOnePrivilegedUserById(id);
            if(user){
                const passwordData:ChangePasswordDto=request.body;
               await this.service.changePrivilegedUserPasswordByAdmin(user,passwordData);
                response.send({status:200,
                message:"password has been successfully updated"});

            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }



    }



}

export default UserController;