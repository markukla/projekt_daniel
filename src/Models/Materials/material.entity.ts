import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsString} from "class-validator";

@Entity("materials")
class Material{

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({unique:true,length:6})

    materialCode:string;

    @Column({unique:true})
    materialName:string;


    constructor(materialCode: string, materialName: string) {
        this.materialCode = materialCode;
        this.materialName = materialName;
    }
}
export default Material;