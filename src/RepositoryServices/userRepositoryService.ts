import {DeleteResult, EntityManager, getManager, getRepository} from "typeorm";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/Users/user.entity";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";

import * as bcrypt from "bcrypt";

import ChangePasswordDto from "../authentication/changePassword.dto";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import UpdatePrivilegedUserWithouTPasswordDto from "../Models/Users/PrivilegedUsers/modyfyUser.dto";
import validatePassword from "../utils/validatePassword/validate.password";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import CreateBusinessPartnerDto from "../Models/Users/BusinessPartner/businessPartner.dto";
import BusinessPartnerNotFoundException from "../Exceptions/BusinessPartnerNotFoundException";
import UpdateBussinessPartnerWithoutPassword from "../Models/Users/BusinessPartner/modyfyBusinessPartent.dto";
import UserWithThisEmailDoesNotExistException from "../Exceptions/UserWithThisEmailDoesNotExistException";
import WeekPasswordException from "../Exceptions/ToWeekPasswordException";
import PasswordValidationResult from "../utils/validatePassword/passwordValidationResult";
import PrivilligedUserNotFoundException from "../Exceptions/PrivilligedUserNotFoundException";

class UserService implements RepositoryService {

    public manager: EntityManager = getManager();
    public repository=getRepository(User);


    // In this app privileged users are admins and editors. Editor can be changed to admin and admin to editor


    public async findUserByEmail(email: string): Promise<User> {

        const foundUser = await this.manager.findOne(User,
            {email: email},
            {relations: ['roles']});

            return foundUser;





    }

    public async registerPrivilegedUser(userData: CreatePrivilegedUserDto): Promise<User> {
        if (await this.findUserByEmail(userData.email)) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const validationResult: PasswordValidationResult = validatePassword(userData.password); // 

        let hashedPassword = null;
        if (validationResult.validatedPassword) { //
            hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);
        } else {
            throw new WeekPasswordException(validationResult.foultList);
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
            password: hashedPassword,

        };

        const savedUser = await this.manager.save(User, user);
        savedUser.password = undefined;

        return savedUser;
    }


    public getAllPrivilegedUsers = async (): Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers: User[] = await this.manager.find(User, {relations: ['roles']});

        const adminOrEditors: User[] = [];


        allUsers.forEach(user => {
            if (this.UserHasPartnerRole(user) === false) {
                adminOrEditors.push(user);
            }
        });


        return adminOrEditors;
    }

    public findOnePrivilegedUserById = async (id: string): Promise<User> => {


        const foundUser: User = await this.manager.findOne(User, id, {relations: ['roles']});
        if (!foundUser) {
            throw new UserNotFoundException(String(id));
        } else if (foundUser) {
            if (!this.UserHasPartnerRole(foundUser)) {
                return foundUser;
            } else {
                throw new PrivilligedUserNotFoundException(String(id));
            }

        }


    }

    public updatePrivilegedUserWithoutPasssword = async (id: number, userData: UpdatePrivilegedUserWithouTPasswordDto): Promise<User> => {
        let privilligedUserToupdate: User = await this.findOnePrivilegedUserById(String(id));
        if (privilligedUserToupdate) {
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
            const updatedUser = await this.findOnePrivilegedUserById(String(id));
            updatedUser.password = undefined;

            return updatedUser;


        }


    }

    public deletePrivilegedUserById = async (id: number):Promise<DeleteResult> => {
        const foundPriviligedUser = await this.findOnePrivilegedUserById(String(id));
        // dont allow to delete partners on user endpoint
        if (foundPriviligedUser) {
            const deleteResponse:DeleteResult = await this.manager.delete(User, id);
            return deleteResponse;
        }


    }
    public changePrivilegedUserPasswordByAdmin = async (user: User, passwordData: ChangePasswordDto): Promise<User> => {
        const foundPrivilligedUser = await this.findOnePrivilegedUserById(String(user.id));
        if (foundPrivilligedUser) {

            const validationResult = validatePassword(passwordData.newPassword);


            if (validationResult.validatedPassword) { //
                let hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);

                const userToUpdatePassword = this.manager.create(User, {
                    ...user,
                    password: hashedPassword

                });
                const updatedUser = await this.manager.save(User, userToUpdatePassword);
                return updatedUser;
            } else {
                throw new WeekPasswordException(validationResult.foultList);
            }


        }


    }

    // business partners are app users with lowest priviliges.
    public async registerBusinessPartner(businessPartnerdata: CreateBusinessPartnerDto): Promise<User> {
        if (await this.findUserByEmail(businessPartnerdata.email)) {
            throw new UserWithThatEmailAlreadyExistsException(businessPartnerdata.email);
        }
        const businesPartnerRoles: Role[] = [new Role(RoleEnum.PARTNER)];
        const validationResult:PasswordValidationResult = validatePassword(businessPartnerdata.password);
        if(validationResult.validatedPassword){
            const hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);
            const businesPartner = this.manager.create(User, {
                ...businessPartnerdata,
                roles: businesPartnerRoles,
                password: hashedPassword,

            });
            await this.manager.save(businesPartner);
            businesPartner.password = undefined;

            return businesPartner;
        }
        else if(validationResult.foultList) {
            throw new WeekPasswordException(validationResult.foultList)
        }

    }


    public getAllBusinessPartners = async (): Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers: User[] = await this.manager.find(User, {relations: ['roles']});
        const businesPartners: User[] = [];

        allUsers.forEach(user => {
            if (this.UserHasPartnerRole(user)) // if user is business partner
            {
                businesPartners.push(user);
            }
        });
        return businesPartners;
    }

    public findOnePartnerById = async (id: string): Promise<User> => {


        const foundUser: User = await this.manager.findOne(User, id, {relations: ['roles']});
        if (!foundUser) {
            throw new BusinessPartnerNotFoundException(String(id));
        }
        const foundUserIsPartner: boolean = this.UserHasPartnerRole(foundUser);
        if (foundUserIsPartner) {
            return foundUser;
        } else {
            throw new BusinessPartnerNotFoundException(String(id));
        }


    }

    public updatePartnerById = async (id: number, businesesPartnerData: UpdateBussinessPartnerWithoutPassword): Promise<User> => {
        let partnerToupdate: User = await this.findOnePartnerById(String(id));
        if (!partnerToupdate) {
            throw new BusinessPartnerNotFoundException(String(id));

        }
        const userWiththisIdIsBusinessPartner: boolean = this.UserHasPartnerRole(partnerToupdate);
        if (!userWiththisIdIsBusinessPartner) {
            throw new BusinessPartnerNotFoundException(String(id));
        }


        // dont allow to change email if email is asigned to other user or businessPartner, becasuse it make proper log in process imposssible
        const userWithThisEmail: User =
            await this.manager.findOne(User,
                {email: businesesPartnerData.email},
                {relations: ['roles']});

        const otherUserWithThisEmailAlreadyExist: boolean = (userWithThisEmail && userWithThisEmail.id !== id);
        if (otherUserWithThisEmailAlreadyExist) {
            throw new UserWithThatEmailAlreadyExistsException(businesesPartnerData.email);
        }

        const businessPartner = this.manager.create(User, {
            ...businesesPartnerData,
            id: id

        });
        await this.manager.save(businessPartner);

        const updatedPartner = await this.manager.findOne(User, id, {relations: ['roles']});
        updatedPartner.password = undefined;
        return updatedPartner;

    }

    public deletePartnerById = async (id: number):Promise<DeleteResult> => {
        const foundUser = await this.findOnePartnerById(String(id));
        if (!this.UserHasPartnerRole(foundUser)) {
            throw new BusinessPartnerNotFoundException(String(id));
        }
        const deleteResponse:DeleteResult= await this.manager.delete(User, id);
        return deleteResponse;

    }
    public changePartnerPasswordByEditor = async (businessPartner: User, passwordData: ChangePasswordDto): Promise<User> => {
        const foundPartnerdUser = await this.findOnePartnerById(String(businessPartner.id));
        if (foundPartnerdUser) {

            const validationResult:PasswordValidationResult = validatePassword(passwordData.newPassword);


            if (validationResult.validatedPassword) { //
                let hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);

                const businessPartnerToUpdatePassword = this.manager.create(User, {
                    ...businessPartner,
                    password: hashedPassword

                });
                const updatedPartner = await this.manager.save(User, businessPartnerToUpdatePassword);
                return updatedPartner;
            } else {
                throw new WeekPasswordException(validationResult.foultList);
            }


        }


    }


    public UserHasPartnerRole = (user: User): boolean => {
        let isPartner: boolean = false;

        user.roles.forEach(role => {
            if (role.rolename === RoleEnum.PARTNER) {
                isPartner = true;

            }
        });


        return isPartner;

    }
    public UserHasEditorRole = (user: User): boolean => {
        let isEditor: boolean = false;

        user.roles.forEach(role => {
            if (role.rolename === RoleEnum.EDITOR) {
                isEditor = true;

            }
        });


        return isEditor;

    }
    public UserHasAdminRole = (user: User): boolean => {
        let isAdmin: boolean = false;

        user.roles.forEach(role => {
            if (role.rolename === RoleEnum.ADMIN) {
                isAdmin = true;

            }
        });


        return isAdmin;

    }
    public UserHasEditorRoleButIsNotAdmin = (user: User): boolean => {
        let isEditorButNotAdmin: boolean = false;
        let isAdmin: boolean = false;
        let isEditor: boolean = false;
        user.roles.forEach(role => {
            if (role.rolename === RoleEnum.ADMIN) {
                isAdmin = true;

            }
            if (role.rolename === RoleEnum.EDITOR) {
                isEditor = true;

            }
        });
        if (isEditor && !isAdmin) {
            isEditorButNotAdmin = true;
        }


        return isEditorButNotAdmin;

    }


}

export default UserService;


