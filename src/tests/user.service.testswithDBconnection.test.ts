import 'reflect-metadata';
import 'es6-shim';
import 'dotenv/config';
import {createConnection, getManager} from "typeorm";
import {insertRolesToDatabase, insertTestUsersToDatabase} from "../utils/DatabaseUtil/insertTestDataToDatabase";
import UsersExampleForTests from "./usersExampleForTests";
import UserService from "../RepositoryServices/userRepositoryService";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";
import {
    clearDatabase,
    closeConnectionToDatabase,
    connectToDatabase
} from "../utils/DatabaseUtil/manageDatabaseConnection";
import {config_test} from "../../ormconfig";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";
import WeekPasswordException from "../Exceptions/ToWeekPasswordException";
import validatePassword from "../utils/validatePassword/validate.password";
import {bool} from "envalid";
import User from "../Models/Users/user.entity";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import PrivilligedUserNotFoundException from "../Exceptions/PrivilligedUserNotFoundException";
import UpdatePrivilegedUserWithouTPasswordDto from "../Models/Users/PrivilegedUsers/modyfyUser.dto";
import ChangePasswordDto from "../authentication/changePassword.dto";
import * as bcrypt from "bcrypt";
import UserWithThisEmailDoesNotExistException from "../Exceptions/UserWithThisEmailDoesNotExistException";
import CreateBusinessPartnerDto from "../Models/Users/BusinessPartner/businessPartner.dto";
import BusinessPartnerNotFoundException from "../Exceptions/BusinessPartnerNotFoundException";
import UpdateBussinessPartnerWithoutPassword from "../Models/Users/BusinessPartner/modyfyBusinessPartent.dto";
import PasswordValidationResult from "../utils/validatePassword/passwordValidationResult";


beforeAll(async () => {


    await connectToDatabase(config_test);
    const manager = getManager();
    if (manager.connection.isConnected) {

        await insertRolesToDatabase(manager);
        await insertTestUsersToDatabase(manager);


    }


});
afterAll(async () => {

    await closeConnectionToDatabase(config_test);


});


describe('user service', () => {
    describe('find user by email',()=>{
        it('should resolve undefinded if user not found', async function () {
            const userService= new UserService();
            const usersStubs=new UsersExampleForTests();
            const unreachableEmail='niematakiegomaila@gmail.com';
            await expect(userService.findUserByEmail(unreachableEmail)).resolves.toBeUndefined();

        });
        it('should not throw error end resolve if user found', async function () {
            const userService= new UserService();
            const usersStubs=new UsersExampleForTests();
            const reachableEmail=usersStubs.activeAdminUserExample.email;
            await expect(userService.findUserByEmail(reachableEmail)).resolves.toMatchObject(usersStubs.activeAdminUserExample);

        });

    });


    describe('when registering a privilliged user', () => {
        const userexamples = new UsersExampleForTests();
        const exampleAdminUserDto: CreatePrivilegedUserDto = userexamples.createAdminUserDto;
        const exampleAdminUserInDatabase = userexamples.activeAdminUserExample;
        const exampleEditorInDatabase = userexamples.activeEditorUserExample;

        describe('when user email already exist in database', () => {


            const userEmail: string = exampleAdminUserDto.email;
            it('it shoud  throw user already exist error(mocked test)', async () => {


                const userService = new UserService();

                await expect(userService.registerPrivilegedUser(exampleAdminUserDto)).rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(exampleAdminUserDto.email));


            });

        });
        describe('when user email does not exist in database', () => {
            const userStabs = new UsersExampleForTests();


            it('it shoud  not throw user already exist error and register an editor if is admin is false', async () => {

                const notExistingEditorUserDTO = userStabs.createEditorUserDto;

                const userService = new UserService();

                const savedUser: User = await userService.registerPrivilegedUser(notExistingEditorUserDTO);
                if(savedUser){
                    console.log(savedUser);
                }

                const isEditor = userService.UserHasEditorRoleButIsNotAdmin(savedUser);
                await expect(isEditor).toBe(true);


            });
            it('it shoud  not throw user already exist error and register an admin if is admin is true', async () => {

                const notExistingAdminUserDto = {
                    ...userStabs.createAdminUserDto,
                    email: "nowyadmin@gmail.com",
                    fullName: "Nowy Admin"
                };


                const userService = new UserService();
                const savedUser: User = await userService.registerPrivilegedUser(notExistingAdminUserDto);
                const isAdmin = userService.UserHasAdminRole(savedUser);
                await expect(isAdmin).toBe(true);


            });
        });


        describe('when password is to week it should throw an error', () => {

            it('sholud throw to week password exception', async () => {
                const userStabs = new UsersExampleForTests();
                const notExistingInDatabaseAdminDto = {
                    ...userStabs.createAdminUserDto,
                    email: "newpadminr@gmail.com",
                    fullName: "nowy admin20",
                    password: "weak"
                };
                const userService = new UserService();
                const validationResult = validatePassword(notExistingInDatabaseAdminDto.password);
                const foultList: string[] = validationResult.foultList;

                await expect(userService.registerPrivilegedUser(notExistingInDatabaseAdminDto)).rejects.toMatchObject(new WeekPasswordException(foultList));

            });

        });

    });
    describe('when fetching all priviligedUser from database', () => {
        describe('checkin user roles', () => {


            it('sholuld not get users with partner role', async () => {
                const userService = new UserService();
                const privilligedUsers: User[] = await userService.getAllPrivilegedUsers();

                let hasOnlyUsers: boolean = true;

                privilligedUsers.forEach(user => {

                    if (userService.UserHasPartnerRole(user)) {
                        console.log(user);

                        hasOnlyUsers = false;
                    }
                });

                await expect(hasOnlyUsers).toBe(true);


            });

        });
        describe('when there are user  in database', () => {
            //i need to add working code to clear User table first
            it('shoul be resoleved to be defined', async () => {
                const userService = new UserService();


                await expect(userService.getAllPrivilegedUsers()).resolves.toBeDefined();// no error


            });


        });

    });
    describe('when findOnePrivilegedUserById', () => {
        describe('when user with given id does not exist', () => {
            it('should throw an error: User with this id does not exist', async () => {
                const userService = new UserService();
                const unreachableId: string = String(500);
                await expect(userService.findOnePrivilegedUserById(unreachableId)).rejects.toMatchObject(new UserNotFoundException(unreachableId));
            });
        });

        describe('when user with given id does exist but has partner role', () => {
            it('should throw an error: Privilliged user with this id does not exist', async () => {
                const userService = new UserService();

                const userStabs=new UsersExampleForTests();

                const partnerId: string = String(userStabs.activePartnerUserExample.id);
                await expect(userService.findOnePrivilegedUserById(partnerId)).rejects.toMatchObject(new PrivilligedUserNotFoundException(partnerId));
            });
        });
        describe('when user with given id exists and does not have partner role', () => {
            it('should be resoleved without error', async () => {

                const userService = new UserService();

                const userStabs=new UsersExampleForTests();

                const privilligedUserId: string = String(userStabs.activeEditorUserExample.id)
                await expect(userService.findOnePrivilegedUserById(privilligedUserId)).resolves.toBeDefined();
            });
        });


    });
    describe('updatePrivilegedUserWithoutPasssword', () => {
        describe('if someone want to update email to one which is already taken by other user', () => {
            it('should throw error: other user with this email already exist', async () => {
                const userService = new UserService();

                const usersStabs = new UsersExampleForTests();
                const priviligedUserId = usersStabs.activeAdminUserExample.id;//1
                const takenEmail = usersStabs.inactiveAdminUserExample.email; // email already taken by user with id 2, so

                const updatePrivilegedUserWithouTPasswordDto: UpdatePrivilegedUserWithouTPasswordDto = {
                    ...usersStabs.updatePrivilligedUserDto,
                    email: takenEmail

                };

                await expect(userService.updatePrivilegedUserWithoutPasssword(priviligedUserId, updatePrivilegedUserWithouTPasswordDto)).rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(takenEmail));

            });

        });
        describe('if someone one to update email which is not taken', () => {
            it('no error thrown, updated executed', async () => {
                const userService = new UserService();

                const usersStabs = new UsersExampleForTests();
                const priviligedUserId =usersStabs.activeAdminUserExample.id; //1

                const updatePrivilegedUserWithouTPasswordDto: UpdatePrivilegedUserWithouTPasswordDto = {
                    ...usersStabs.updatePrivilligedUserDto,


                };

                await expect(userService.updatePrivilegedUserWithoutPasssword(priviligedUserId, updatePrivilegedUserWithouTPasswordDto)).resolves.toBeDefined();

            });

        });
        describe('if someone one to update email to value already asigned to user', () => {
            it('no error thrown, updated executed', async () => {
                const userService = new UserService();
                const usersStabs = new UsersExampleForTests();
                const priviligedUserId =usersStabs.activeAdminUserExample.id; //1

                const emailofUserofId1 = usersStabs.activeAdminUserExample.email;
                const updatePrivilegedUserWithouTPasswordDto: UpdatePrivilegedUserWithouTPasswordDto = {
                    ...usersStabs.updatePrivilligedUserDto,
                    email: emailofUserofId1


                };

                await expect(userService.updatePrivilegedUserWithoutPasssword(priviligedUserId, updatePrivilegedUserWithouTPasswordDto)).resolves.toBeDefined();

            });

        })
        describe('if someone change is admin to false from true admin role schould be deleted', () => {
            it('should delete admin role, and still contain editor role', async () => {
                const userService = new UserService();
                const usersStabs = new UsersExampleForTests();
                const privilligedUserId=usersStabs.activeAdminUserExample.id; //1
                const updatePrivilegedUserWithouTPasswordDto: UpdatePrivilegedUserWithouTPasswordDto = {
                    ...usersStabs.updatePrivilligedUserDto,
                    isAdmin: false


                };
                const updatedUser = await userService.updatePrivilegedUserWithoutPasssword(privilligedUserId, updatePrivilegedUserWithouTPasswordDto);
                if(updatedUser){
                    console.log(updatedUser);
                }
                const isEditorButNotAdmin: boolean = userService.UserHasEditorRoleButIsNotAdmin(updatedUser);
                await expect(isEditorButNotAdmin).toBe(true);
            });
        });
        describe('if someone change is admin to true from false admin role schould be added, and still contain editor role', () => {
            it('should add admin role, and still contain editor role', async () => {
                const userService = new UserService();

                const usersStabs = new UsersExampleForTests();
                const privilligedUserId=usersStabs.activeAdminUserExample.id; //1
                const updatePrivilegedUserWithouTPasswordDto: UpdatePrivilegedUserWithouTPasswordDto = {
                    ...usersStabs.updatePrivilligedUserDto,
                    isAdmin: true


                };
                const updatedUser = await userService.updatePrivilegedUserWithoutPasssword(privilligedUserId, updatePrivilegedUserWithouTPasswordDto);
                if(updatedUser){
                    console.log(updatedUser);
                }
                const isAdmin: boolean = userService.UserHasAdminRole(updatedUser)&&userService.UserHasEditorRole(updatedUser);
                await expect(isAdmin).toBe(true);
            });
        })
        describe('when user is not privilliged user but partner',()=>{
            it('should throw an eror: privilliged user with id not found ',async ()=>{
                const userService = new UserService();
                const idOfPartnerWhichIsNotPrivilligedUser=5;

                const usersStabs = new UsersExampleForTests();
                const updatePrivilegedUserWithouTPasswordDto: UpdatePrivilegedUserWithouTPasswordDto = {
                    ...usersStabs.updatePrivilligedUserDto,
                    isAdmin: true


                };
                await expect  (userService.updatePrivilegedUserWithoutPasssword(idOfPartnerWhichIsNotPrivilligedUser, updatePrivilegedUserWithouTPasswordDto)).rejects.toMatchObject(new PrivilligedUserNotFoundException(String(idOfPartnerWhichIsNotPrivilligedUser)));


            });
        });


    });

    describe('changePrivilegedUserPasswordByAdmin',()=>{
        describe('it shoud not allow to change partner password',()=>{
            it('should throw error:PrivilligedUserNotFound',async ()=>{
                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const invalidPrivilegedUserToUpdatePassword: User = {
                    ...usersStabs.activePartnerUserExample

                };
                const passwordData:ChangePasswordDto={
                    newPassword:'Nicram12345'
                };

                await expect(userService.changePrivilegedUserPasswordByAdmin(invalidPrivilegedUserToUpdatePassword,passwordData)).rejects.toMatchObject(new PrivilligedUserNotFoundException(String(invalidPrivilegedUserToUpdatePassword.id)));
            });


        });
        describe('it shoud not allow to change password if passsword is to week',()=>{
            it('should throw error:Week Password Exception',async ()=>{
                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const validPrivilegedUserToUpdatePassword: User = {
                    ...usersStabs.activeEditorUserExample

                };
                const passwordData:ChangePasswordDto={
                    newPassword:'ner'
                };
                const foultList:string[]=validatePassword(passwordData.newPassword).foultList;

                await expect(userService.changePrivilegedUserPasswordByAdmin(validPrivilegedUserToUpdatePassword,passwordData)).rejects.toMatchObject(new WeekPasswordException(foultList));
            });


        });
        describe('it shoud  allow to change password if priviliged user and strong password',()=>{
            it('should change password without error',async ()=>{
                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const validPrivilegedUserToUpdatePassword: User = {
                    ...usersStabs.activeEditorUserExample

                };
                const passwordData:ChangePasswordDto={
                    newPassword:'Nicramnk12'
                };

                const hased1NewPassword=await bcrypt.hash(passwordData.newPassword,10);
                if(hased1NewPassword){
                    console.log(`hased1NewPassword=${hased1NewPassword}`);
                }
                const hased2NewPassword=await bcrypt.hash(passwordData.newPassword,10);
                if(hased2NewPassword){
                    console.log(`hased2NewPassword=${hased2NewPassword}`);
                }


             const savedUserWithNewPassword=  await userService.changePrivilegedUserPasswordByAdmin(validPrivilegedUserToUpdatePassword,passwordData);
               if(savedUserWithNewPassword){

                   await expect(bcrypt.compare(passwordData.newPassword,savedUserWithNewPassword.password)).resolves.toBe(true);
                   }



            });


        })

    });
    describe('deletePrivilegedUserById',  ()=> {
        describe('When not privilled user',  ()=> {
            it('should not delete and throw error:No privillage user', async function () {

                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const invalidPrivilegedUserToDelete: User = {
                    ...usersStabs.inactivePartnerUserExample

                };
                await expect(userService.deletePrivilegedUserById(invalidPrivilegedUserToDelete.id)).rejects.toMatchObject(new PrivilligedUserNotFoundException(String(invalidPrivilegedUserToDelete.id)));


            });


        });

        describe('When privilled user',  ()=> {
            it('should succesfully delete', async function () {

                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const validPrivilegedUserToDelete: User = {
                    ...usersStabs.inactiveAdminUserExample

                };
                await expect(userService.deletePrivilegedUserById(validPrivilegedUserToDelete.id)).resolves.toBeDefined();


            });


        })

    });

    // businesss partners tests

    describe('find user by email',()=>{
        it('should resolve undefinded if user not found', async function () {
            const userService= new UserService();
            const usersStubs=new UsersExampleForTests();
            const unreachableEmail='niematakiegomaila@gmail.com';
            await expect(userService.findUserByEmail(unreachableEmail)).resolves.toBeUndefined();

        });
        it('should not throw error end resolve if user found', async function () {
            const userService= new UserService();
            const usersStubs=new UsersExampleForTests();
            const reachableEmail=usersStubs.activePartnerUserExample.email;
            await expect(userService.findUserByEmail(reachableEmail)).resolves.toMatchObject(usersStubs.activePartnerUserExample);

        });

    });


    describe('when registering a business partner', () => {
        const userexamples = new UsersExampleForTests();
        const examplePartnerDto: CreateBusinessPartnerDto = {
            ...userexamples.createPartnerDto,
            email:userexamples.activePartnerUserExample.email
        };

        describe('when user email already exist in database', () => {



            it('it shoud  throw user already exist error', async () => {


                const userService = new UserService();

                await expect(userService.registerBusinessPartner(examplePartnerDto)).rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(examplePartnerDto.email));


            });

        });
        describe('when user email does not exist in database', () => {
            const userStabs = new UsersExampleForTests();


            it('it shoud  not throw user already exist error and register a Business Partner', async () => {

                const notExistingPartnerUserDTO = {
                    ...userStabs.createPartnerDto,
                    email:'notklfmsfksdl20@gmail.com'
                };

                const userService = new UserService();

                const savedPartner: User = await userService.registerBusinessPartner(notExistingPartnerUserDTO);
                if(savedPartner){
                    console.log(savedPartner);
                }

                const isPartner:boolean = userService.UserHasPartnerRole(savedPartner);
                await expect(isPartner).toBe(true);


            });

        });


        describe('when password is to week it should throw an error', () => {

            it('sholud throw to week password exception', async () => {
                const userStabs = new UsersExampleForTests();
                const notExistingInDatabasePartnerDto = {
                    ...userStabs.createPartnerDto,
                    email: "dlsfjskjdkgfkjg@gmail.com",
                    fullName: "Nowy partner",
                    password: "weak"
                };
                const userService = new UserService();
                const validationResult:PasswordValidationResult = validatePassword(notExistingInDatabasePartnerDto.password);
                const foultList: string[] = validationResult.foultList;

                await expect(userService.registerBusinessPartner(notExistingInDatabasePartnerDto)).rejects.toMatchObject(new WeekPasswordException(foultList));

            });

        });

    });
    describe('when fetching all business partners from database', () => {
        describe('checkin user roles', () => {


            it('sholuld not get users with editor or admin role', async () => {
                const userService = new UserService();
                const partnersUsers: User[] = await userService.getAllBusinessPartners();

                let hasOnlyPartnerRole: boolean = true;

                partnersUsers.forEach(user => {

                    if (userService.UserHasAdminRole(user)||userService.UserHasEditorRole(user)) {
                        console.log(user);

                        hasOnlyPartnerRole = false;
                    }
                });

                await expect(hasOnlyPartnerRole).toBe(true);


            });

        });
        describe('when there are business Partner in Database ', () => {
            //i need to add working code to clear User table first
            it('shoul be resoleved to be defined', async () => {
                const userService = new UserService();

                await expect(userService.getAllBusinessPartners()).resolves.toBeDefined();// no error


            });


        });

    });
    describe('when findOneBusinessPartnerById', () => {
        describe('when business partner with given id does not exist', () => {
            it('should throw an error: BusinesPartner with this id does not exist', async () => {
                const userService = new UserService();
                const unreachableId: string = String(500);
                await expect(userService.findOnePartnerById(unreachableId)).rejects.toMatchObject(new BusinessPartnerNotFoundException(unreachableId));
            });
        });

        describe('when user with given id does exist but has editor or admin role(it is not business partner)', () => {
            it('should throw an error: Privilliged user with this id does not exist', async () => {
                const userService = new UserService();

                const userStabs=new UsersExampleForTests();

                const adminId: string = String(userStabs.activeAdminUserExample.id);
                await expect(userService.findOnePartnerById(adminId)).rejects.toMatchObject(new BusinessPartnerNotFoundException(adminId));
            });
        });
        describe('when business partner with given id exists and does not have admin or editor role', () => {
            it('should be resoleved without error', async () => {

                const userService = new UserService();

                const userStabs=new UsersExampleForTests();

                const partnerUserId: string = String(userStabs.inactivePartnerUserExample.id)
                await expect(userService.findOnePartnerById(partnerUserId)).resolves.toBeDefined();
            });
        });


    });
    describe('updatePartnerWithoutPasssword', () => {
        describe('if someone want to update email to one which is already taken by other user', () => {
            it('should throw error: other user with this email already exist', async () => {
                const userService = new UserService();

                const usersStabs = new UsersExampleForTests();
                const partnerInDatabase = usersStabs.activePartnerUserExample.id;//1
                const takenEmail = usersStabs.inactivePartnerUserExample.email; // email already taken by existing in database partner,

                const updatePartnerDto: UpdateBussinessPartnerWithoutPassword = {
                    ...usersStabs.updatePartnerDto,
                    email: takenEmail

                };

                await expect(userService.updatePartnerById(partnerInDatabase, updatePartnerDto)).rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(takenEmail));

            });

        });
        describe('if someone one to update email which is not taken', () => {
            it('no error thrown, update executed', async () => {
                const userService = new UserService();

                const usersStabs = new UsersExampleForTests();
                const PartnerUserId =usersStabs.activePartnerUserExample.id; //1

                const updatePartnerDto: UpdateBussinessPartnerWithoutPassword = {
                    ...usersStabs.updatePartnerDto,
                    email:'kjdjfd@gmail.com'


                };

                await expect(userService.updatePartnerById(PartnerUserId, updatePartnerDto)).resolves.toBeDefined();

            });

        });
        describe('if someone one to update email to value already asigned to Business Partner', () => {
            it('no error thrown, updated executed', async () => {
                const userService = new UserService();
                const usersStabs = new UsersExampleForTests();
                const savedPartnerId =usersStabs.activePartnerUserExample.id; //1

                const emailofPartnerSavedinDatabase = usersStabs.activePartnerUserExample.email;
                const updatedPartnerDto: UpdateBussinessPartnerWithoutPassword = {
                    ...usersStabs.updatePartnerDto,
                    email: emailofPartnerSavedinDatabase

                };

                await expect(userService.updatePartnerById(savedPartnerId, updatedPartnerDto)).resolves.toBeDefined();

            });

        });


        describe('when  user is not business Partner but privilliged User',()=>{
            it('should throw an eror: Business partner with id not found ',async ()=>{
                const userService = new UserService();
                const usersStabs = new UsersExampleForTests();
                const idOfUserWhichIsnotBusinessPartner=usersStabs.activeAdminUserExample.id;


                const updatePartnerDto: UpdateBussinessPartnerWithoutPassword = {
                    ...usersStabs.updatePartnerDto,
                    email:"newPartneremial@gmial.com"

                };
                await expect  (userService.updatePartnerById(idOfUserWhichIsnotBusinessPartner, updatePartnerDto)).rejects.toMatchObject(new BusinessPartnerNotFoundException(String(idOfUserWhichIsnotBusinessPartner)));


            });
        });


    });

    describe('changeBusinessPartnerPasswordByEditor',()=>{
        describe('when user is  privilliged User ',()=>{
            it('it should throw error:PrivilligedUserNotFound, and do not allow to change Password',async ()=>{
                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const invalidPartnerUserToUpdatePassowrd: User = {
                    ...usersStabs.activeAdminUserExample

                };
                const passwordData:ChangePasswordDto={
                    newPassword:'Nicram12345'
                };

                await expect(userService.changePartnerPasswordByEditor(invalidPartnerUserToUpdatePassowrd,passwordData)).rejects.toMatchObject(new BusinessPartnerNotFoundException(String(invalidPartnerUserToUpdatePassowrd.id)));
            });


        });
        describe('when passsword is to week',()=>{
            it('should throw error:Week Password Exception and do not allow to change passowrd',async ()=>{
                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const validPartnerUserToUpdatePassword: User = {
                    ...usersStabs.activePartnerUserExample

                };
                const passwordData:ChangePasswordDto={
                    newPassword:'ner'
                };
                const foultList:string[]=validatePassword(passwordData.newPassword).foultList;

                await expect(userService.changePartnerPasswordByEditor(validPartnerUserToUpdatePassword,passwordData)).rejects.toMatchObject(new WeekPasswordException(foultList));
            });


        });
        describe('when partner user and strong password',()=>{
            it('should change password without error',async ()=>{
                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const validPartnerUserToUpdatePassword: User = {
                    ...usersStabs.activePartnerUserExample

                };
                const passwordData:ChangePasswordDto={
                    newPassword:'Nicramnk12'
                };

                const hased1NewPassword=await bcrypt.hash(passwordData.newPassword,10);
                if(hased1NewPassword){
                    console.log(`hased1NewPassword=${hased1NewPassword}`);
                }
                const hased2NewPassword=await bcrypt.hash(passwordData.newPassword,10);
                if(hased2NewPassword){
                    console.log(`hased2NewPassword=${hased2NewPassword}`);
                }


                const savedPartnerWithNewPassword=  await userService.changePartnerPasswordByEditor(validPartnerUserToUpdatePassword,passwordData);
                if(savedPartnerWithNewPassword){

                    await expect(bcrypt.compare(passwordData.newPassword,savedPartnerWithNewPassword.password)).resolves.toBe(true);
                }



            });


        })

    });
    describe('deletePartnerById',  ()=> {
        describe('When not business partner',  ()=> {
            it('should not delete and throw error:No Business partner', async function () {

                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const invalidPartnerUserToDelete: User = {
                    ...usersStabs.activeAdminUserExample

                };
                await expect(userService.deletePartnerById(invalidPartnerUserToDelete.id)).rejects.toMatchObject(new BusinessPartnerNotFoundException(String(invalidPartnerUserToDelete.id)));


            });


        });

        describe('When partner user',  ()=> {
            it('should succesfully delete', async function () {

                const userService = new UserService();


                const usersStabs = new UsersExampleForTests();
                const validPartnerUserToDelete: User = {
                    ...usersStabs.inactivePartnerUserExample

                };
                await expect(userService.deletePartnerById(validPartnerUserToDelete.id)).resolves.toBeDefined();


            });


        })

    });




});

