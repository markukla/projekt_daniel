import {BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import Role from "../Role/role.entity";
import {IsBoolean} from "class-validator";

@Entity("users")
class User {

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    fulName: string;

    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    active: boolean;
    @IsBoolean()
    isAdmin:boolean;

@ManyToMany(()=>Role)  //here we reference to entity name, not table name
    @JoinTable()

    roles: Role[];

}
export default User;
