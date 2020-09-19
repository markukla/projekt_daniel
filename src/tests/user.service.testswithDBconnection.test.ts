import 'reflect-metadata';
import 'es6-shim';
import 'dotenv/config';
import {createConnection, getManager} from "typeorm";
import {insertRolesToDatabase, insertTestUsersToDatabase} from "../utils/DatabaseUtil/insertTestDataToDatabase";
import UsersExampleForTests from "../Models/Users/usersExampleForTests";
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
                    email: "newpartner@gmail.com",
                    fullName: "nowy partner",
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
        describe('when there is now user in database', () => {
            //i need to add working code to clear User table first
            it('shoul be resoleved to be defined', async () => {
                const userService = new UserService();


                await expect(userService.getAllPrivilegedUsers()).resolves.toBeDefined();// no error


            });


        });

    });
    describe('when findOnePrivilegedUserById',()=>{
        describe('when user with given id does not exist',()=>{
            it('should throw an error: User with this is does not exist',async ()=>{
                const userService=new UserService();
                const unreachableId:string=String(500);
                await expect(userService.findOnePrivilegedUserById(unreachableId)).rejects.toMatchObject(new UserNotFoundException(unreachableId));
            });
        });

        describe('when user with given id does exist but has partner role',()=>{
            it('should throw an error: Privilliged user with this id does not exist',async ()=>{
                const userService=new UserService();
                const partnerId:string=String(5);
                await expect(userService.findOnePrivilegedUserById(partnerId)).rejects.toMatchObject(new PrivilligedUserNotFoundException(partnerId));
            });
        });
        describe('when user with given id does exist and does not have partner role',()=>{
            it('should be resoleved without error',async ()=>{
                const userService=new UserService();
                const partnerId:string=String(1);
                await expect(userService.findOnePrivilegedUserById(partnerId)).resolves.toBeDefined();
            });
        });



    });


});

