import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import User from "../User/user.entity";

@Entity("roles")
class Role  {




@PrimaryColumn()
    rolename: string;



}
    export default Role;