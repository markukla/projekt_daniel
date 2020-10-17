import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsString} from "class-validator";
import Order from "../Order/order.entity";

@Entity("materials")
class Material{

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({unique:true,length:6})

    materialCode:string;

    @Column({unique:true})
    materialName:string;

    @OneToMany(()=>Order,(order:Order)=>order.productMaterial)
    orders:Order[];


    constructor(materialCode: string, materialName: string) {
        this.materialCode = materialCode;
        this.materialName = materialName;
    }
}
export default Material;