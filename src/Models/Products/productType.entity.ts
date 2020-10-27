import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductTop from "./productTop.entity";
import ProductBottom from "./productBottom.entity";


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

    @ManyToMany(()=>ProductTop,{eager:true})
    @JoinTable({name:"productType_productTop_id_pairs"})
    productTopsAvailableToThisProductType:ProductTop[];

    @ManyToMany(()=>ProductBottom, {eager:true})
    @JoinTable({name:"productType_productBottom_id_pairs"})
    productBottomsAvailableToThisProductType:ProductBottom[];



}
export default ProductType;


