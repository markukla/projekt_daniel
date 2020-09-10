import {getManager} from "typeorm";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";

import * as bcrypt from "bcrypt";

import ChangePasswordDto from "../authentication/changePassword.dto";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import UpdateUserWithouTPasswordDto from "../Models/User/modyfyUser.dto";
import validatePassword from "../authentication/validate.password";
import UserNotFoundException from "../Exceptions/UserNotFoundException";

class UserService implements RepositoryService {

    public manager = getManager();


    public async registerUser(userData: CreateUserDto): Promise<User> {
        if (
            await this.manager.findOne(User,
                {email: userData.email},
                {relations: ['roles']}
            )
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const validatedPassword = validatePassword(userData.password);
        const hashedPassword = await bcrypt.hash(validatedPassword, 10);

        let createdRoles: Role[];
        if (userData.isAdmin) {
            createdRoles = [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)];
        } else {
            createdRoles = [new Role(RoleEnum.EDITOR)];
        }


        const user = {
            ...userData,
            roles: createdRoles,
            password: hashedPassword,

        };

        await this.manager.save(User, user);

        user.password = undefined;

        return user;
    }


    public getAllAdminsOrEditors = async (): Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers: User[] = await this.manager.find(User, {relations: ['roles']});
        const adminOrEditors: User[] = [];


       allUsers.forEach(user => {
           if(this.UserHasPartnerRole(user)===false){
               adminOrEditors.push(user);
           }
       });




        return adminOrEditors;
    }

    public findOneUserById = async (id: string): Promise<User> => {


        const foundUser: User = await this.manager.findOne(User, id, {relations: ['roles']});
        if(!foundUser){
            throw new UserNotFoundException(String(id));
        }
        // do not alllow to operate on partners in users endpoints
        if (!this.UserHasPartnerRole(foundUser)) {
            return foundUser;
        } else {
            new UserNotFoundException(String(id));
        }


    }

    public updateUserWithoutPasssword = async (id: number, userData: UpdateUserWithouTPasswordDto): Promise<User> => {
        let userToupdate: User = await  this.findOneUserById(String(id));
        if (!userToupdate) {
            throw new UserNotFoundException(String(id));

        }
        const userWiththisIdIsBusinessPartner: boolean =this.UserHasPartnerRole(userToupdate);
        if (userWiththisIdIsBusinessPartner) {
            throw new UserNotFoundException(String(id));
        }


// i use save for updating, becasue update method does not work with object related to other object with many to many relation, in this case users-and roles

        // dont allow to change email to email which is asigned to other user or businessPartner, becasuse it make proper log in process imposssible
        const userWithThisEmail: User =
            await this.manager.findOne(User,
                {email: userData.email},
                {relations: ['roles']});


        const otherUserWithThisEmailAlreadyExist: boolean = (userWithThisEmail && userWithThisEmail.id !== id);

        if (otherUserWithThisEmailAlreadyExist) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }


        let createdRoles: Role[];
        if (userData.isAdmin) {
            createdRoles = [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)];
        } else {
            createdRoles = [new Role(RoleEnum.EDITOR)];
        }

        const user = {
            ...userData,
            roles: createdRoles,
            id: id
        };

        await this.manager.save(User, user);


        const updatedUser = await this.manager.findOne(User, id, {relations: ['roles']});
        updatedUser.password = undefined;
        return updatedUser;

    }

    public deleteUserById = async (id: number) => {
        const foundUser=await this.findOneUserById(String(id));
        if(this.UserHasPartnerRole(foundUser)){ // dont allow to delete partners on user endpoint
            throw new UserNotFoundException(String(id));
        }

        const deleteResponse = await this.manager.delete(User, id);
        return deleteResponse;

    }
    public changeUserPasswordByAdmin = async (user: User, passwordData: ChangePasswordDto): Promise<User> => {
if(this.UserHasPartnerRole(user)){ // dont allow to change parter role on user endpoint
    throw new UserNotFoundException(String(user.id));
}
        const validatedPassword: string = validatePassword(passwordData.newPassword);
        var hashedPassword: string = await bcrypt.hash(validatedPassword, 10);
        user.password = hashedPassword;
        await this.manager.save(User, user)
        const updatedUser = await this.manager.findOne(User, user.id);
        return updatedUser;

    }

    public  UserHasPartnerRole=(user:User):boolean=>{
        let isPartner:boolean=false;

            user.roles.forEach(role=>
            {
                if(role.rolename===RoleEnum.PARTNER){
                    isPartner=true;

                }
            });


        return isPartner;

}
    public  UserHasEditorRole=(user:User):boolean=>{
        let isEditor:boolean=false;

        user.roles.forEach(role=>
        {
            if(role.rolename===RoleEnum.EDITOR){
                isEditor=true;

            }
        });


        return isEditor;

    }
    public  UserHasAdminRole=(user:User):boolean=>{
        let isAdmin:boolean=false;

        user.roles.forEach(role=>
        {
            if(role.rolename===RoleEnum.EDITOR){
                isAdmin=true;

            }
        });


        return isAdmin;

    }
    public  UserHasEditorRoleButIsNotAdmin=(user:User):boolean=>{
        let isEditorButNotAdmin:boolean=false;
        let isAdmin:boolean=false;
        let isEditor:boolean=false;
        user.roles.forEach(role=>
        {
            if(role.rolename===RoleEnum.ADMIN){
                isAdmin=true;

            }
            if(role.rolename===RoleEnum.EDITOR){
                isEditor=true;

            }
        });
        if(isEditor&&!isAdmin){
            isEditorButNotAdmin=true;
        }


        return isEditorButNotAdmin;

    }


}

export default UserService;


