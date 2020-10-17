import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import Role from "../Role/role.entity";
import {IsBoolean} from "class-validator";
import Order from "../Order/order.entity";

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

    @Column({nullable:true})
    code?: string;
    @Column({nullable:true})
    businesPartnerCompanyName?: string;

@ManyToMany(()=>Role)  //here we reference to entity name, not table name
    @JoinTable()

    roles: Role[];

@OneToMany(()=>Order,(order:Order)=>order.businessPartner)  //one businessPartene:USer can be asigned to many orders
    ordersAsignedToBusinessPartner:Order[];


@OneToMany(()=>Order,(order:Order)=>order.creator)  //use user can create many orders
ordersCreatedByUser:Order[];

}

export default User;
