import UsersExampleForTests from "../../src/Models/Users/usersExampleForTests";
import User from "../../src/Models/Users/user.entity";
import Role from "../../src/Models/Role/role.entity";
import RoleEnum from "../../src/Models/Role/role.enum";
import * as typeorm from "typeorm";
import {EntityManager, getManager} from "typeorm";

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