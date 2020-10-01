import * as typeorm from "typeorm";
import UsersExampleForTests from "./usersExampleForTests";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";
import UserService from "../RepositoryServices/userRepositoryService";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";
import {createConnection, EntityManager, getManager} from "typeorm";
import {config, config_test} from "../../ormconfig";
import {closeConnectionToDatabase, connectToDatabase} from "../utils/DatabaseUtil/manageDatabaseConnection";
import {insertRolesToDatabase, insertTestUsersToDatabase} from "../utils/DatabaseUtil/insertTestDataToDatabase";


beforeAll( ()=>{
    (typeorm as any).getManager=jest.fn();


});


describe('when registering a privilliged user',()=>{
    const userexamples=new UsersExampleForTests();
    const exampleAdminUserDto:CreatePrivilegedUserDto=userexamples.createAdminUserDto;
    const exampleAdminUserInDatabase=userexamples.activeAdminUserExample;
    const exampleEditorInDatabase=userexamples.activeEditorUserExample;

    describe('when user email already exist in database',()=>{


        const userEmail:string=exampleAdminUserDto.email;
        it('it shoud  throw user already exist error(mocked test)',async ()=>{
            (typeorm as any).getManager=jest.fn();
            const userService=new UserService();
            userService.findUserByEmail=jest.fn().mockReturnValue(exampleAdminUserInDatabase);
            (typeorm as any).getManager.mockReturnValue({
                save:()=>Promise.resolve(exampleAdminUserInDatabase),
            });



await expect(userService.registerPrivilegedUser(exampleAdminUserDto)).rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(exampleAdminUserDto.email));


        });

    });
    describe('when user email does not exist in database',()=>{

        const userEmail:string=exampleAdminUserDto.email;
        it('it shoud  not throw user already exist error',async ()=>{
            const exampleUser=new UsersExampleForTests().activeAdminUserExample;
           console.log(exampleUser);
            const exampleUserDto=new UsersExampleForTests().createAdminUserDto;



            (typeorm as any).getManager= jest.fn().mockReturnValue({
                save:()=>Promise.resolve(exampleUser), // should not have undefined as
            });  // dont forget this fuckin semicolons
            const userService=new UserService();
            userService.findUserByEmail=jest.fn().mockReturnValue(null);
            console.log(await userService.registerPrivilegedUser(exampleUserDto));
            console.log(exampleUser);
            await expect(userService.registerPrivilegedUser(exampleUserDto)).resolves.toMatchObject(exampleUser);


        });
    });




});