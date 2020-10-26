import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";


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

}

export default ProductTop;
