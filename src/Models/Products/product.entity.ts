import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("products")
class Product{  // this class represents type of product and technical drawing of product

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    productType:string;

    @Column()
    productCode:string;

    @Column()
    productTopType:string;

    @Column()
    productTopCode:string;

    @Column()
    productBottomType:string;

    @Column()
    productBottomCode:string;

    @Column()
    dimensionsCodes:string; // all dimensions separeted by coma


    @Column()
    urlOfOrginalDrawing:string;

    @Column()
    urlOfThumbnailDrawing:string; // smaller drawing obtained by library

    @Column()
    urlOfDrawingFormHtmlView:string;  // it is a html view which consits of orginal drawing and table with html form to be filled by the user (information table below the drawing)


    constructor(productType: string, productCode: string, productTopType: string, productTopCode: string, productBottomType: string, productBottomCode: string, urlOfOrginalDrawing: string, urlOfThumbnailDrawing: string, urlOfDrawingFormHtmlView: string) {
        this.productType = productType;
        this.productCode = productCode;
        this.productTopType = productTopType;
        this.productTopCode = productTopCode;
        this.productBottomType = productBottomType;
        this.productBottomCode = productBottomCode;
        this.urlOfOrginalDrawing = urlOfOrginalDrawing;
        this.urlOfThumbnailDrawing = urlOfThumbnailDrawing;
        this.urlOfDrawingFormHtmlView = urlOfDrawingFormHtmlView;
    }
}

export default Product;