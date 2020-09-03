import * as express from 'express';
import {getManager, getRepository, Repository} from "typeorm";
import Post from "../Models/Post/post.entity";
import CreatePostDto from "../Models/Post/post.dto";
import PostNotFoundException from "../Exceptions/PostNotFoundException";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";
import TokenData from "../interfaces/tokenData.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import LogInDto from "../authentication/logIn.dto";
import WrongCredentialsException from "../Exceptions/WrongCredentialsException";
import ChangePasswordDto from "../authentication/changePassword.dto";
import IncorrectPaswordException from "../Exceptions/IncorrectPaswordException";
class UserService implements RepositoryService{

    public manager=getManager();


    public createNewRecord = async (userData:CreateUserDto):Promise<User> => {
       try{
        const newUser=await this.manager.create(User,userData);
        await this.manager.save(User,newUser);
        return newUser;
       }
       catch (e) {
           return e;
           console.log(`${e.type}`);
           console.log(`${e.message}`);



       }
    }
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


