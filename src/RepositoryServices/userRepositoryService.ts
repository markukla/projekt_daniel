import {getManager} from "typeorm";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";

import * as bcrypt from "bcrypt";

import ChangePasswordDto from "../authentication/changePassword.dto";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import BusinesPartner from "../Models/BusinessPartner/businesPartner.entity";
import UpdateUserWithouTPasswordDto from "../Models/User/modyfyUser.dto";

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

        let createdRoles:Role[];
        if(userData.isAdmin){
            createdRoles=[new Role(RoleEnum.ADMIN),new Role(RoleEnum.EDITOR)];
        }
        else {
            createdRoles=[new Role(RoleEnum.EDITOR)];
        }

        const user = {
            ...userData,
            roles:createdRoles,
            password:hashedPassword
        };

        await this.manager.save(User,user);

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

    public modifyRecordWithoutPasssword = async (id:number, userData:UpdateUserWithouTPasswordDto):Promise<User> => {



// i use save for updating, becasue update method does not work with object related to other object with many to many relation, in this case users-and roles

    // dont allow to change email if email is asigned to other user or businessPartner, becasuse it make proper log in process imposssible
const userWithThisEmail:User=
    await this.manager.findOne(User,
    {email: userData.email},
    {relations: ['roles']});
const businesspartnerWithThisEmail:BusinesPartner=await this.manager.findOne(BusinesPartner,
    {email: userData.email},
    {relations: ['roles']}
);
const otherUserWithThisEmailAlreadyExist:boolean=(userWithThisEmail&&userWithThisEmail.id!==id);
const otheBusinessPartnetWithThisEmailAlreadyExist:boolean=(businesspartnerWithThisEmail&&businesspartnerWithThisEmail.id!==id);
        if (otherUserWithThisEmailAlreadyExist||otheBusinessPartnetWithThisEmailAlreadyExist) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        let createdRoles:Role[];
        if(userData.isAdmin){
            createdRoles=[new Role(RoleEnum.ADMIN),new Role(RoleEnum.EDITOR)];
        }
        else {
            createdRoles=[new Role(RoleEnum.EDITOR)];
        }

        const user = {
            ...userData,
            roles:createdRoles,
            id:id
        };

        await this.manager.save(User,user);



        const updatedUser = await  this.manager.findOne(User,id,{relations: ['roles']});
updatedUser.password=undefined;
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


