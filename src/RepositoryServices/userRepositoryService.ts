
import {getManager, getRepository, Repository} from "typeorm";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";

import * as bcrypt from "bcrypt";

import ChangePasswordDto from "../authentication/changePassword.dto";

class UserService implements RepositoryService{

    public manager=getManager();


    public async register(userData: CreateUserDto):Promise<User> {
        if (
            await this.manager.findOne(User,
                {email: userData.email},
                {relations: ['roles']}
            )
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.manager.create(User,{
            ...userData,
            password: hashedPassword,
        });
        await this.manager.save(user);
        user.password = undefined;

        return user;
    }


    public getAllRecords = async ():Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const recordss=await this.manager.find(User,{relations: ['roles']});
        return recordss;
    }

    public findOneRecord = async (id: string):Promise<User> => {


      const foundUser:User = await this.manager.findOne(User,id,{relations: ['roles']});
        return foundUser;

    }

    public modifyRecord = async (id:number,userData:User):Promise<User> => {



// i use save for updating, becasue update method does not work with object related to other object with many to many relation, in this case users-and roles
            userData.userid = Number(id);
        if (
            await this.manager.findOne(User,
                {email: userData.email},
                {relations: ['roles']}
            )
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.manager.create(User,{
            ...userData,
            password: hashedPassword,
        });
        await this.manager.save(user);
        user.password = undefined;


        const updatedUser = await  this.manager.findOne(User,id,{relations: ['roles']});

        return updatedUser;

    }

    public deleteRecord = async (id:number) => {

         const deleteResponse = await this.manager.delete(User,id);
        return deleteResponse;

    }
    public changeUserPasswordByAdmin=async (user:User,passwordData:ChangePasswordDto)=>{


            var hashedPassword:string= await bcrypt.hash(passwordData.newPassword,10);
           user.password= hashedPassword;
               await this.manager.save(User,user)
            }



}

export default UserService;


