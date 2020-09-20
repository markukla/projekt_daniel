import Role from "../Role/role.entity";
import RoleEnum from "../Role/role.enum";
import User from "./user.entity";
import CreatePrivilegedUserDto from "./PrivilegedUsers/user.dto";
import CreateBusinessPartnerDto from "./BusinessPartner/businessPartner.dto";
import {IsBoolean, IsEmail, IsString} from "class-validator";
import UpdatePrivilegedUserWithouTPasswordDto from "./PrivilegedUsers/modyfyUser.dto";

class UsersExampleForTests {
    public hashedPassword: string = "$2b$10$fpooDkA4UaG/9nDsuuUmB.bIUJ7ittTknMl8nEMQ9o28UQPXqdZBC";
    public correctUnhashedPasswordOfexampleUserInDatabase: string = "Nicram12";
    public wrongUnhashedPasswordOfexampleUserInDatabase: string = "Nicrrerere12";
    public activeAdminUserExample: User = {
        fulName: 'John Smith',
        email: 'john@smith.com',
        password: this.hashedPassword,
        active: true,
        id: 1,
        roles: [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)],
        businesPartnerCompanyName: null,
        code: null
    }
    public inactiveAdminUserExample: User = {
        fulName: 'John Snow',
        email: 'john@snow.com',
        password: this.hashedPassword,
        active: false,
        id: 2,
        roles: [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)],
        businesPartnerCompanyName: null,
        code: null
    }
    public activeEditorUserExample: User = {
        fulName: 'John vader',
        email: 'john@vader.com',
        password: this.hashedPassword,
        active: true,
        id: 3,
        roles: [new Role(RoleEnum.EDITOR)],
        businesPartnerCompanyName: null,
        code: null
    }
    public inactiveEditorUserExample: User = {
        fulName: 'Marcin Kukla',
        email: 'marcin@kukla.com',
        password: this.hashedPassword,
        active: true,
        id: 3,
        roles: [new Role(RoleEnum.EDITOR)],
        businesPartnerCompanyName: null,
        code: null
    }
    public activePartnerUserExample: User = {
        fulName: 'Marian kukla',
        email: 'marian@kukla.com',
        password: this.hashedPassword,
        active: true,
        id: 4,
        roles: [new Role(RoleEnum.PARTNER)],
        businesPartnerCompanyName: 'polpharma',
        code: 'AST4'
    }
    public inactivePartnerUserExample: User = {
        fulName: 'Natalia Kukla',
        email: 'natalia@kukla.com',
        password: this.hashedPassword,
        active: false,
        id: 4,
        roles: [new Role(RoleEnum.PARTNER)],
        businesPartnerCompanyName: 'polpharma',
        code: 'AST4'
    }
    public createAdminUserDto: CreatePrivilegedUserDto = {


        "fulName": 'John Smith',
        "email": 'john@smith.com',
        "password": "Nicram12",
        "active": true,
        "isAdmin": true

    }
    public createEditorUserDto: CreatePrivilegedUserDto = {


        "fulName": 'Marcin kuklinski',
        "email": 'kuklinski@gmail.com',
        "password": "Nicram12",
        "active": true,
        "isAdmin": false

    }

    public createPartnerDto: CreateBusinessPartnerDto = {

        "fulName": 'Jan Kowalski',
        "email": 'kowalski@gmail.com',
        "password": "Nicram12",
        "active": true,
        "code": "POL1",
        "businesPartnerCompanyName": "Polpharma",
    }

    public updatePrivilligedUserDto:UpdatePrivilegedUserWithouTPasswordDto={
        "fulName": 'updated fullName',
        "email": 'updated@gmail.com',
        "active": true,
        "isAdmin": true
    }

}

export default UsersExampleForTests;