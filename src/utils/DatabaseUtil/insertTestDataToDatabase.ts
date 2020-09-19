import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';
import UsersExampleForTests from "../../Models/Users/usersExampleForTests";
import User from "../../Models/Users/user.entity";
import Role from "../../Models/Role/role.entity";
import RoleEnum from "../../Models/Role/role.enum";
import {EntityManager} from "typeorm";



const usersExampleForTests:UsersExampleForTests=new UsersExampleForTests();
const users:User[]=[usersExampleForTests.activeAdminUserExample,usersExampleForTests.inactiveAdminUserExample,usersExampleForTests.activeEditorUserExample,usersExampleForTests.activePartnerUserExample,usersExampleForTests.inactivePartnerUserExample];
const roles:Role[]=[new Role(RoleEnum.PARTNER),new Role(RoleEnum.EDITOR),new Role(RoleEnum.ADMIN)];

async function insertTestUsersToDatabase(manager:EntityManager) {
    await manager.save(User,users);
    console.log("test users inserted")

}
async function insertRolesToDatabase(manager:EntityManager){
    await manager.save(Role,roles);
    console.log("user roles for tests inserted")
}
export{insertRolesToDatabase,insertTestUsersToDatabase};