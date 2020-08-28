import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import Role from "../Role/role.entity";

@Entity("users")
class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    name: string;

    @Column()
    lastname:string;

    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    isactive: boolean;

@ManyToMany(()=>Role)  //here we reference to entity name, not table name
    @JoinTable()
    roles: Role[];


}
export default User;