import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Order from "../Order/order.entity";
import ProductType from "./productType.entity";
import ProductBottom from "./productBottom.entity";
import ProductTop from "./productTop.entity";

@Entity("products")
class Product{  // this class represents type of product and technical drawing of product

    @PrimaryGeneratedColumn()
    public id?: number;

   @ManyToOne(()=>ProductType,(productType:ProductType)=>productType.productsWithThisType,{eager:true,cascade:true})
   productType:ProductType;

    @ManyToOne(()=>ProductBottom,(productBottom:ProductBottom)=>productBottom.productsWithThisBottomType,{eager:true,cascade:true})
    productBottom:ProductBottom;

    @ManyToOne(()=>ProductBottom,(productBottom:ProductBottom)=>productBottom.productsWithThisBottomType,{eager:true,cascade:true})
    productTop:ProductTop;

    @Column()
    dimensionsCodes:string; // all dimensions separeted by coma


    @Column()
    urlOfOrginalDrawing:string;

    @Column()
    urlOfThumbnailDrawing:string; // smaller drawing obtained by library
  // it is a html view which consits of orginal drawing and table with html form to be filled by the user (information table below the drawing)


}

export default Product;
