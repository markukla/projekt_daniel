import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";


import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";

import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import UserService from "../RepositoryServices/userRepositoryService";
import UserNotFoundException from "../Exceptions/UserNotFoundException";


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
        this.router.patch(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateUserDto, true), this.modyfyUser);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneUserById);
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


private modyfyUser = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const userData:User=request.body;
        const id:number=Number(request.params.id);
        try {
            const modyfiedUser = await this.service.modifyRecord(id, userData);
if(modyfiedUser){
    response.send(modyfiedUser)}
else {next(new UserNotFoundException(String(id)));

}
        }
        catch (error) {
            response.send({
                errorName:`${error.name}`,
                erorMessage:`${error.message}`

            })

        }
}
private getAllUsers = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
{
try{
    const users:User[]=await this.service.getAllRecords();
    response.send(users);


}
catch (error) {
    response.send({
        errorName:`${error.name}`,
        erorMessage:`${error.message}`

    })

}
}

private getOneUserById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
const id:number=Number(request.params.id);
        try{
    const foundUser=await this.service.findOneRecord(id);
    if(foundUser){
        response.send(foundUser)
    }
    else {
       next(new UserNotFoundException(String(id))) ;
    }
}
        catch (error) {
            response.send({
                errorName:`${error.name}`,
                erorMessage:`${error.message}`

            })

        }

}
    private deleteOneUserById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:number=Number(request.params.id);
        try{
            const deleTedResponse=await this.service.deleteRecord(id);
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
            response.send({
                errorName:`${error.name}`,
                erorMessage:`${error.message}`

            })

        }

    }


}

export default UserController;