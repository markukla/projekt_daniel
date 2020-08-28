import {BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity("roles")
class Role extends BaseEntity {



    @PrimaryColumn()

    rolename: string;

    @Column()
    roleDescription: string;

}
    export default Role;