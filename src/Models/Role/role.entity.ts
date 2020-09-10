import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import User from "../User/user.entity";
import RoleEnum from "./role.enum";

@Entity("roles")
class Role {


    @PrimaryColumn()
    rolename:RoleEnum;


    constructor(rolename: RoleEnum) {
        this.rolename = rolename;
    }


}

export default Role;