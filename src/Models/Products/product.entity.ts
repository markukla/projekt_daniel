import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Order from "../Order/order.entity";
import ProductType from "./productType.entity";
import ProductBottom from "./productBottom.entity";
import ProductTop from "./productTop.entity";
import Dimension from "../OrderDetail/dimension";
import DimensionTextFIeldInfo from "./dimensionTextFIeldInfo";

@Entity("products")
class Product{  // this class represents type of product and technical drawing of product

    @PrimaryGeneratedColumn()
    public id?: number;

   @ManyToOne(()=>ProductType,(productType:ProductType)=>productType.productsWithThisType, {eager:true}) //eager cause strange error table name (long alias name) is spacyfied more than once
   productType:ProductType;

    @ManyToOne(()=>ProductBottom,(productBottom:ProductBottom)=>productBottom.productsWithThisBottomType,{eager:true})
    productBottom:ProductBottom;

    @ManyToOne(()=>ProductBottom,(productBottom:ProductBottom)=>productBottom.productsWithThisBottomType,{eager:true})
    productTop:ProductTop;

    @Column()
    dimensionsCodes:string; // all dimensions separeted by coma


    @Column()
    urlOfOrginalDrawing:string;

    @Column()
    urlOfThumbnailDrawing:string; // smaller drawing obtained by library

    @Column({type:"jsonb"})
    dimensionsTextFieldInfo:DimensionTextFIeldInfo[];



}

export default Product;
