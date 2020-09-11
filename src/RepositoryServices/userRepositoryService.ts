import {getManager} from "typeorm";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/Users/user.entity";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";

import * as bcrypt from "bcrypt";

import ChangePasswordDto from "../authentication/changePassword.dto";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import UpdatePrivilegedUserWithouTPasswordDto from "../Models/Users/PrivilegedUsers/modyfyUser.dto";
import validatePassword from "../authentication/validate.password";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import CreateBusinessPartnerDto from "../Models/Users/BusinessPartner/businessPartner.dto";
import BusinessPartnerNotFoundException from "../Exceptions/BusinessPartnerNotFoundException";
import UpdateBussinessPartnerWithoutPassword from "../Models/Users/BusinessPartner/modyfyBusinessPartent.dto";

class UserService implements RepositoryService {

    public manager = getManager();


    // In this app privileged users are admins and editors. Editor can be changed to admin and admin to editor


    public async registerPrivilegedUser(userData: CreatePrivilegedUserDto): Promise<User> {
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


    public getAllPrivilegedUsers = async (): Promise<User[]> => {
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

    public findOnePrivilegedUserById = async (id: string): Promise<User> => {


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

    public updatePrivilegedUserWithoutPasssword = async (id: number, userData: UpdatePrivilegedUserWithouTPasswordDto): Promise<User> => {
        let userToupdate: User = await  this.findOnePrivilegedUserById(String(id));
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

    public deletePrivilegedUserById = async (id: number) => {
        const foundUser=await this.findOnePrivilegedUserById(String(id));
        if(this.UserHasPartnerRole(foundUser)){ // dont allow to delete partners on user endpoint
            throw new UserNotFoundException(String(id));
        }

        const deleteResponse = await this.manager.delete(User, id);
        return deleteResponse;

    }
    public changePrivilegedUserPasswordByAdmin = async (user: User, passwordData: ChangePasswordDto): Promise<User> => {
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

    // business partners are app users with lowest priviliges.
    public async registerBusinessPartner(businessPartnerdata: CreateBusinessPartnerDto):Promise<User> {
        if (

            await this.manager.findOne(User,
                {email: businessPartnerdata.email},
                {relations: ['roles']}
            )
        ) {
            throw new UserWithThatEmailAlreadyExistsException(businessPartnerdata.email);
        }
        const businesPartnerRoles: Role[]=[new Role(RoleEnum.PARTNER)];
        const validatedPassword=validatePassword(businessPartnerdata.password);
        const hashedPassword = await bcrypt.hash(validatedPassword, 10);
        const businesPartner = this.manager.create(User,{
            ...businessPartnerdata,
            roles:businesPartnerRoles,
            password: hashedPassword,

        });
        await this.manager.save(businesPartner);
        businesPartner.password = undefined;

        return businesPartner;
    }


    public getAllBusinessPartners = async ():Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers:User[]=await this.manager.find(User,{relations: ['roles']});
        const businesPartners:User[]=[];

        allUsers.forEach(user =>{
            if(this.UserHasPartnerRole(user)) // if user is business partner
            {
                businesPartners.push(user);
            }
        } );
        return businesPartners;
    }

    public findOnePartnerById = async (id: string):Promise<User> => {


        const foundUser:User = await this.manager.findOne(User,id,{relations: ['roles']});
        if(!foundUser){
            throw new BusinessPartnerNotFoundException(String(id));
        }
        const foundUserIsPartner:boolean=this.UserHasPartnerRole(foundUser);
        if(foundUserIsPartner){
            return foundUser;
        }
        else {
            new BusinessPartnerNotFoundException(String(id));
        }


    }

    public updatePartnerById = async (id:number, businesesPartnerData:UpdateBussinessPartnerWithoutPassword):Promise<User> => {
        let partnerToupdate:User=await this.findOnePartnerById(String(id));
        if (!partnerToupdate) {
            throw new BusinessPartnerNotFoundException(String(id));

        }
        const userWiththisIdIsBusinessPartner:boolean=this.UserHasPartnerRole(partnerToupdate);
        if(!userWiththisIdIsBusinessPartner){
            throw new BusinessPartnerNotFoundException(String(id));
        }


        // dont allow to change email if email is asigned to other user or businessPartner, becasuse it make proper log in process imposssible
        const userWithThisEmail:User=
            await this.manager.findOne(User,
                {email: businesesPartnerData.email},
                {relations: ['roles']});

        const otherUserWithThisEmailAlreadyExist:boolean=(userWithThisEmail&&userWithThisEmail.id!==id);
        if (otherUserWithThisEmailAlreadyExist) {
            throw new UserWithThatEmailAlreadyExistsException(businesesPartnerData.email);
        }

        const businessPartner = this.manager.create(User,{
            ...businesesPartnerData,
            id:id

        });
        await this.manager.save(businessPartner);

        const updatedPartner = await  this.manager.findOne(User,id,{relations: ['roles']});
        updatedPartner.password=undefined;
        return updatedPartner;

    }

    public deletePartnerById = async (id:number) => {
        const foundUser= await this.findOnePartnerById(String(id));
        if(!this.UserHasPartnerRole(foundUser)){
            throw new BusinessPartnerNotFoundException(String(id));
        }
        const deleteResponse = await this.manager.delete(User,id);
        return deleteResponse;

    }
    public changePartnerPasswordByEditor=async (businessPartner:User, passwordData:ChangePasswordDto):Promise<User>=>{
        if(!this.UserHasPartnerRole(businessPartner)){
            throw new BusinessPartnerNotFoundException(String(businessPartner.id));
        }
        const validatedPassword=validatePassword(passwordData.newPassword);
        const hashedPassword:string= await bcrypt.hash(validatedPassword,10);
        businessPartner.password= hashedPassword;
        await this.manager.save(User,businessPartner)
        const updatedBusinessParter=await this.findOnePartnerById(String(businessPartner.id));
        return updatedBusinessParter;
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


