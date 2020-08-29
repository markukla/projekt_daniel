import {BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import Role from "../Role/role.entity";

@Entity("users")
class User {

    @PrimaryGeneratedColumn()
    public userid?: number;

    @Column()
    fulName: string;

    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    active: boolean;

@ManyToMany(()=>Role)  //here we reference to entity name, not table name
    @JoinTable()

    roles: Role[];


}
export default User;
