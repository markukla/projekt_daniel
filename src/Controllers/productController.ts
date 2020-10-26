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


    constructor() {
        this.initializeRoutes();
    }
    private handleError=(err:Error, res:express.Response) => {
        res
            .status(500)
            .contentType("text/plain")
            .end("Oops! Something went wrong!");
    };
    public upload = multer({
        dest: "../../public/images"
        // you might also want to set some limits: https://github.com/expressjs/multer#limits

    });



    private initializeRoutes() {
        this.router.get(this.path, authMiddleware,adminAuthorizationMiddleware,this.getAllProducts);

        this.router.get(`${this.path}/:id`, this.getOneProductById);
        this.router.post(`${this.path}/:id`,this.upload.single("file"), validationMiddleware(CreateProductDto, true), this.updateProductById);//remeber to add authentication admin authorization middleware after tests
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneProductById);
        this.router.post(this.path,this.upload.single("file"),validationMiddleware(CreateProductDto), this.addOneProduct);//remeber to add authentication admin authorization middleware after tests
        this.router.get(`/addProduct`, this.getAddProductFormView);
        this.router.get(`/updateProduct/:id`, this.getUpdateProductFormView);


    }

    private addOneProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
       const targetPath=this.uploadedDrawingToserwerAndGetPath(req,res,next);
        const productData: CreateProductDto = req.body;
        console.log(productData);

        try {
            const product:Product = await this.service.addOneProduct(productData,targetPath); // it is probably wrong path

            res.send({
                message:"new Product added:",
                product:product
            });
        } catch (error) {
            next(error);
        }
    }


    private updateProductById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const productData:CreateProductDto=request.body;
        const id:string=request.params.id;
        const drawingPath=this.uploadedDrawingToserwerAndGetPath(request,response,next);
        try {
            const updatedProduct = await this.service.updateProductById(id, productData,drawingPath);
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


    private uploadedDrawingToserwerAndGetPath= (req: express.Request, res: express.Response, next: express.NextFunction):string => {
        // actually file is already uploaded by multer middleware we just check it path extension is correct and if not remove file by fs.unlink

        if(!req.file){
            res.send({
                   status:403,
                    message:"cannot add product, because no drawign choosen"


            });

        }
        const tempPath :string= req.file.path;
        console.log(tempPath);


        const fileName:string=req.file.originalname;
        const date:Date=new Date();
        const time=date.getTime();

        const targetPath:string = path.join(__dirname, `../../public/images/`,`${time}${fileName}`);
        console.log(targetPath);
        /* path starts from host*/
        const host = req.host;
        console.log(host);
        const filePath = req.protocol + "://" + host + ':5000/' +`${time}public/images/${fileName}`;



        if (path.extname(req.file.originalname).toLowerCase() === ".pdf") {
            fs.rename(tempPath, targetPath, err => {
                if (err) {
                    return this.handleError(err, res);
                }




            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return this.handleError(err, res);

                res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only .png files are allowed!");
            });
        }
        return targetPath;

    }

    private getAddProductFormView=async (request: express.Request, response: express.Response, next: express.NextFunction)=> {
        return  response.render('addProduct');

    }
    private getUpdateProductFormView=async (request: express.Request, response: express.Response, next: express.NextFunction)=> {
        return  response.render('updateProduct.ejs');

    }


    }




export default ProductController;