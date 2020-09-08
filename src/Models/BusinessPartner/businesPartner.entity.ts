import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import Role from "../Role/role.entity";
import RoleEnum from "../Role/role.enum";

@Entity("business_partners")
class BusinesPartner {
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
    @Column({default:false})
    isAdmin:boolean;

    @ManyToMany(() => Role)  //here we reference to entity name, not table name
    @JoinTable()
    roles: Role[];
    @Column()
    code: string;
    @Column()
    businesPartnerCompanyName: string;


}

export default BusinesPartner;