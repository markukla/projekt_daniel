import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';
import UsersExampleForTests from "../../tests/usersExampleForTests";
import User from "../../Models/Users/user.entity";
import Role from "../../Models/Role/role.entity";
import RoleEnum from "../../Models/Role/role.enum";
import {EntityManager, getManager, getRepository, Repository} from "typeorm";
import Material from "../../Models/Materials/material.entity";
import MaTerialsExamples from "../../tests/materialsExamplesForTests";



const usersExampleForTests:UsersExampleForTests=new UsersExampleForTests();
const users:User[]=[usersExampleForTests.activeAdminUserExample,usersExampleForTests.inactiveAdminUserExample,usersExampleForTests.activeEditorUserExample,usersExampleForTests.activePartnerUserExample,usersExampleForTests.inactivePartnerUserExample,usersExampleForTests.inactiveEditorUserExample];
const roles:Role[]=[new Role(RoleEnum.PARTNER),new Role(RoleEnum.EDITOR),new Role(RoleEnum.ADMIN)];

async function insertTestUsersToDatabase() {
    const manager=getManager();
    await manager.save(User,users);
    console.log("test users inserted")

}
async function insertRolesToDatabase(){
    const manager=getManager();
    await manager.save(Role,roles);
    console.log("user roles for tests inserted")
}
async function insertTestMaterialsToDatabase(){

    const maTerialsExamples:MaTerialsExamples=new MaTerialsExamples();
    const materials:Material[]=maTerialsExamples.validMaterials;
    const repository=getRepository(Material);
    await repository.save(materials);
    console.log(" materials inserted")
}
export{insertRolesToDatabase,insertTestUsersToDatabase,insertTestMaterialsToDatabase};