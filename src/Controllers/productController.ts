import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";




import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import Material from "../Models/Materials/material.entity";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import Product from "../Models/Products/product.entity";
import ProductService from "../RepositoryServices/productRepositoryService";
import CreateProductDto from "../Models/Products/product.dto";
import ProductNotFoundExceptionn from "../Exceptions/ProductNotFoundException";
import * as multer from "multer";
import * as fs from "fs";
const path = require('path');



class ProductController implements Controller{
    public path = '/products';
    public router = express.Router();
    public  service:ProductService=new ProductService();
    public upload = multer({
        dest: "../../public/images"
        // you might also want to set some limits: https://github.com/expressjs/multer#limits

    });

    constructor() {
        this.initializeRoutes();
    }
    private handleError=(err:Error, res:express.Response) => {
        res
            .status(500)
            .contentType("text/plain")
            .end("Oops! Something went wrong!");
    };



    private initializeRoutes() {
        this.router.get(this.path, authMiddleware,adminAuthorizationMiddleware,this.getAllProducts);

        this.router.get(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.getOneProductById);
        this.router.patch(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateProductDto, true), this.updateProductById);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneProductById);
        this.router.post(this.path,authMiddleware,adminAuthorizationMiddleware,validationMiddleware(CreateProductDto), this.addOneProduct);


    }

    private addOneProduct = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productData: CreateProductDto = request.body;
        try {
            const product:Product = await this.service.addOneProduct(productData);

            response.send(product);
        } catch (error) {
            next(error);
        }
    }


    private updateProductById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const productData:CreateProductDto=request.body;
        const id:string=request.params.id;
        try {
            const updatedProduct = await this.service.updateProductById(id, productData);
            if(updatedProduct){
                response.send(updatedProduct)}
            else {next(new ProductNotFoundExceptionn(id));

            }
        }
        catch (error) {
            next(error);
        }

    }

    private getAllProducts = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const products:Product[]=await this.service.findAllProducts();


            response.send(products);


        }
        catch (error) {
            next(error);
        }


    }

    private getOneProductById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundProduct:Product=await this.service.findOneProductById(id);
            if(foundProduct){
                response.send(foundProduct)
            }
            else {
                next(new ProductNotFoundExceptionn(id));
            }
        }
        catch (error) {
            next(error);
        }



    }
    private deleteOneProductById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const deleTedResponse=await this.service.deleteProductById(id);
            if(deleTedResponse.affected===1){
                response.send({
                    status:200,
                    message:`product with id= ${id} has beeen removed`
                });
            }
            else {
                next(new ProductNotFoundExceptionn(id));
            }
        }
        catch (error) {
            next(error);
        }

    }

    private getUpladDrawingForm=async (request: express.Request, response: express.Response, next: express.NextFunction)=> {
       return  response.render('addProduct');

    }


    }




export default ProductController;