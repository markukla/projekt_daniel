import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";


@Entity("productBottoms")
class ProductBottom {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column({unique:true})
    productBottomType:string;

    @Column({unique:true})
    productBottomCode:string;
    @OneToMany(()=>Product,(productWithThisBottom:Product)=>productWithThisBottom.productBottom)
    productsWithThisBottomType?:Product[];
    @ManyToMany(()=>ProductType,(productType:ProductType)=>productType.productBottomsAvailableToThisProductType)
    productTypesWhichHaveThisProductBottom?:ProductType[]




}

export default ProductBottom;
