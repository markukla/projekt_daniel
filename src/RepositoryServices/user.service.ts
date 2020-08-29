import * as express from 'express';
import {getRepository, Repository} from "typeorm";
import Post from "../Models/Post/post.entity";
import CreatePostDto from "../Models/Post/post.dto";
import PostNotFoundException from "../Exceptions/PostNotFoundException";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";

class UserService implements RepositoryService<User>{
    public repository:Repository<User>=getRepository(User);



    public createNewRecord = async (request: express.Request, response: express.Response) => {
        const userData: CreateUserDto = request.body;
        const newUser = this.repository.create(userData);
        await this.repository.save(newUser);
        response.send(newUser);
    }

    public getAllRecords = async (request: express.Request, response: express.Response) => {
        // in relation option: it takes table name as paramter, not enity name
        const records = await this.repository.find({relations:['roles']});
        response.send(records);
    }

    public findOneRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const user = await this.repository.findOne(id,{relations:['roles']});
        if (user) {
            response.send(user);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public modifyRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const userData: User = request.body;
        try {
// i use save for updating, becasue update method does not work with object related to other object with many to many relation, in this case users-and roles
            userData.userid=Number(id);
            await this.repository.save( userData);

            const updatedUser = await this.repository.findOne(id,{relations:['roles']});
            if (updatedUser) {
                response.send(updatedUser);
            } else {
                next(new PostNotFoundException(id));
            }
        }catch (e) {
            var erroType=e.type;
            var erroMessage=e.message;
            console.log(e.trace);
            response.send({

                "errorType":`${erroType}`,
                "errorMessage":`${erroMessage}`
            })

        }
    }

    public deleteRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.repository.delete(id);
        console.log(deleteResponse);
        if (deleteResponse.affected===1) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default UserService;


