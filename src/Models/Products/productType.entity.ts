import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";


@Entity("productTypes")
class ProductType {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    productTypeName:string;

    @Column()
    productTypeCode:string;

    @OneToMany(()=>Product,(product:Product)=>product.productType)
    productsWithThisType?:Product[];


}
export default ProductType;


