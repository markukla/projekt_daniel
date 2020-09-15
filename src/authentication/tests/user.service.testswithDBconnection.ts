import {closeConnectionToDatabase, connectToDatabase} from "../../../utils/DatabaseUtil/manageDatabaseConnection";
import {config_test} from "../../../ormconfig";
import {EntityManager} from "typeorm";
import * as typeorm from "typeorm";
import {insertRolesToDatabase, insertTestUsersToDatabase} from "../../../utils/DatabaseUtil/insertTestDataToDatabase";
import UserService from "../../RepositoryServices/userRepositoryService";
import UserWithThatEmailAlreadyExistsException from "../../Exceptions/UserWithThatEmailAlreadyExistsException";
import UsersExampleForTests from "../../Models/Users/usersExampleForTests";

beforeAll( async ()=>{
    await connectToDatabase(config_test);
    const manager:EntityManager=typeorm.getManager();
    if(manager.connection.isConnected){
        await insertRolesToDatabase(manager);
        await insertTestUsersToDatabase(manager)
        const userService=new UserService();
    }



});
afterAll(async ()=>{
    await closeConnectionToDatabase(config_test);

});
describe('user service',()=>{
    describe('user service register a user',()=>{
        it('if user email is in databe it sholuld throw user already exist error ',async ()=>{
            const userStabs=new UsersExampleForTests();

            const exampleAdminUserDto=userStabs.createAdminUserDto;
            const userService=new UserService();
            await expect(userService.registerPrivilegedUser(exampleAdminUserDto)).rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(exampleAdminUserDto.email))
        });



    });



});
