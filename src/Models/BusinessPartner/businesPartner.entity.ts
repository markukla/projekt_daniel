import User from "../User/user.entity";
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import Role from "../Role/role.entity";
@Entity("business_partners")
 class BusinesPartner extends User{
    @PrimaryGeneratedColumn()
    public business_partner_id?: number;

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


    @Column()
    code:string;

    @Column()
    businesPartnerCompanyName: string;



}
export default BusinesPartner;