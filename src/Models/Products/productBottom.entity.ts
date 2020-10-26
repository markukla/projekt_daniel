import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";


@Entity("productBottoms")
class ProductBottom {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column({unique:true})
    productBottomType:string;

    @Column({unique:true})
    productBottomCode:string;
    @OneToMany(()=>Product,(productWithThisBottom:Product)=>productWithThisBottom.productBottom)
    productsWithThisBottomType?:Product[]



}

export default ProductBottom;
