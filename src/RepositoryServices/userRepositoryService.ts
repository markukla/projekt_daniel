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
import BusinessPartnerNotFoundException from "../Exceptions/BusinessPartnerNotFoundException";

class UserService implements RepositoryService {

    public manager = getManager();


    public async register(userData: CreateUserDto): Promise<User> {
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
        const isPartner: boolean = false;

        const user = {
            ...userData,
            roles: createdRoles,
            password: hashedPassword,
            isPartner: isPartner
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
            if (user.isPartner === false) {
                adminOrEditors.push(user);
            }

        });

        return adminOrEditors;
    }

    public findOneRecord = async (id: string): Promise<User> => {


        const foundUser: User = await this.manager.findOne(User, id, {relations: ['roles']});
        if(!foundUser){
            throw new UserNotFoundException(String(id));
        }
        if (foundUser.isPartner === false) {
            return foundUser;
        } else {
            new UserNotFoundException(String(id));
        }


    }

    public modifyUserWithoutPasssword = async (id: number, userData: UpdateUserWithouTPasswordDto): Promise<User> => {
        let userToupdate: User = await this.manager.findOne(User, id);
        if (!userToupdate) {
            throw new UserNotFoundException(String(id));

        }
        const userWiththisIdIsBusinessPartner: boolean = userToupdate.isPartner === true;
        if (userWiththisIdIsBusinessPartner) {
            throw new UserNotFoundException(String(id));
        }


// i use save for updating, becasue update method does not work with object related to other object with many to many relation, in this case users-and roles

        // dont allow to change email if email is asigned to other user or businessPartner, becasuse it make proper log in process imposssible
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

    public deleteRecord = async (id: number) => {

        const deleteResponse = await this.manager.delete(User, id);
        return deleteResponse;

    }
    public changeUserPasswordByAdmin = async (user: User, passwordData: ChangePasswordDto): Promise<User> => {

        const validatedPassword: string = validatePassword(passwordData.newPassword);
        var hashedPassword: string = await bcrypt.hash(validatedPassword, 10);
        user.password = hashedPassword;
        await this.manager.save(User, user)
        const updatedUser = await this.manager.findOne(User, user.id);
        return updatedUser;

    }


}

export default UserService;


