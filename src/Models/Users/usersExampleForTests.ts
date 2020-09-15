import Role from "../Role/role.entity";
import RoleEnum from "../Role/role.enum";
import User from "./user.entity";
import CreatePrivilegedUserDto from "./PrivilegedUsers/user.dto";

class UsersExampleForTests {
     public hashedPassword:string="$2b$10$fpooDkA4UaG/9nDsuuUmB.bIUJ7ittTknMl8nEMQ9o28UQPXqdZBC";
    public correctUnhashedPasswordOfexampleUserInDatabase:string="Nicram12";
    public wrongUnhashedPasswordOfexampleUserInDatabase:string="Nicrrerere12";
    public  activeAdminUserExample:User={
        fulName: 'John Smith',
        email: 'john@smith.com',
        password: this.hashedPassword,
        active: true,
        id: 1,
        roles: [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)],
        businesPartnerCompanyName: null,
        code: null
    }
    public  inactiveAdminUserExample:User={
        fulName: 'John Smith',
        email: 'john@smith.com',
        password: this.hashedPassword,
        active: false,
        id: 2,
        roles: [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)],
        businesPartnerCompanyName: null,
        code: null
    }
    public  activeEditorUserExample:User={
        fulName: 'John Smith',
        email: 'john@smith.com',
        password: this.hashedPassword,
        active: true,
        id: 3,
        roles: [ new Role(RoleEnum.EDITOR)],
        businesPartnerCompanyName: null,
        code: null
    }
    public  inactiveEditorUserExample:User={
        fulName: 'John Smith',
        email: 'john@smith.com',
        password: this.hashedPassword,
        active: true,
        id: 3,
        roles: [ new Role(RoleEnum.EDITOR)],
        businesPartnerCompanyName: null,
        code: null
    }
    public  activePartnerUserExample:User={
        fulName: 'John Smith',
        email: 'john@smith.com',
        password: this.hashedPassword,
        active: true,
        id: 4,
        roles: [ new Role(RoleEnum.PARTNER)],
        businesPartnerCompanyName: 'polpharma',
        code: 'AST4'
    }
    public  inactivePartnerUserExample:User={
        fulName: 'John Smith',
        email: 'john@smith.com',
        password: this.hashedPassword,
        active: false,
        id: 4,
        roles: [ new Role(RoleEnum.PARTNER)],
        businesPartnerCompanyName: 'polpharma',
        code: 'AST4'
    }
    public createAdminUserDto:CreatePrivilegedUserDto={


    "fulName":'John Smith',
    "email":'john@smith.com',
    "password":"Nicram12",
    "active":true,
    "isAdmin":true

    }



}
export default UsersExampleForTests;