import * as express from 'express';
import {getManager, getRepository, Repository} from "typeorm";


import RepositoryService from "../interfaces/service.interface";
import User from "../Models/Users/user.entity";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";
import Role from "../Models/Role/role.entity";
import CreateRoleDto from "../Models/Role/role.dto";
import RoleNotFoundException from "../Exceptions/RoleNotFoundException";

class RoleService implements RepositoryService{
    public repository:Repository<Role>=getRepository(Role);
    public manager=getManager();



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
            next(new RoleNotFoundException(id));
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
                next(new RoleNotFoundException(id));
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
            next(new RoleNotFoundException(id));
        }
    }
}

export default RoleService;


