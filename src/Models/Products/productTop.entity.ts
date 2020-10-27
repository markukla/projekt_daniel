import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";


@Entity("productTops")
class ProductTop {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column({unique:true})
    productTopType:string;

    @Column({unique:true})
    productTopCode:string;

    @OneToMany(()=>Product,(productWithThisTop:Product)=>productWithThisTop.productTop)
    productsWithThisTopType?:Product[]
    @ManyToMany(()=>ProductType,(productType:ProductType)=>productType.productTopsAvailableToThisProductType)
    productTypesWhichHaveThisProductTop?:ProductType[]

}

export default ProductTop;
