import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';
import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import User from "../Users/user.entity";
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