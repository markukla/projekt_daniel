import * as express from 'express';
import {getRepository, Repository} from "typeorm";
import Post from "../Models/Post/post.entity";
import CreatePostDto from "../Models/Post/post.dto";
import PostNotFoundException from "../Exceptions/PostNotFoundException";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";
import Role from "../Models/Role/role.entity";
import CreateRoleDto from "../Models/Role/role.dto";

class RoleService implements RepositoryService<Role>{
    public repository:Repository<Role>=getRepository(Role);



    public createNewRecord = async (request: express.Request, response: express.Response) => {
        const roleData: CreateRoleDto = request.body;
        console.log(roleData);
        const newRole = this.repository.create(roleData);
        await this.repository.save(newRole);
        response.send(newRole);
    }

    public getAllRecords = async (request: express.Request, response: express.Response) => {
        const roles = await this.repository.find();
        response.send(roles);
    }

    public findOneRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const role = await this.repository.findOne(id);
        if (role) {
            response.send(role);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public modifyRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const roleData: Role = request.body;
        try {

            await this.repository.save(roleData);

            const updatedRole = await this.repository.findOne(id);
            if (updatedRole) {
                response.send(updatedRole);
            } else {
                next(new PostNotFoundException(id));
            }
        }catch (e) {
            var erroType=e.type;
            var erroMessage=e.message;
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

export default RoleService;


