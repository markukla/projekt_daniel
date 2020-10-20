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
import OrderService from "../RepositoryServices/orderRepositoryService";
import CreateOrderDto from "../Models/Order/order.dto";
import Order from "../Models/Order/order.entity";
const path = require('path');



class OrderController implements Controller{
    public path = '/orders';
    public router = express.Router();
    public  service:OrderService=new OrderService();


    constructor() {
        this.initializeRoutes();
    }



    private initializeRoutes() {
        this.router.get(this.path,this.getAllOrders);

        this.router.get(`${this.path}/:id`, this.getOneOrderById);
        this.router.post(this.path, validationMiddleware(CreateOrderDto), this.addOneOrder);//remeber to add authentication admin authorization middleware after tests





    }

    private addOneOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const orderData: CreateOrderDto = req.body;
        console.log(orderData);


        try {
            const order:Order = await this.service.addOneOrder(orderData); // it is probably wrong path

            res.send({
                message:"new Order added:",
                order:order
            });
        } catch (error) {
            next(error);
        }
    }



    private getAllOrders = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const orders:Order[]=await this.service.findAllOrders();


            response.send(orders);


        }
        catch (error) {
            next(error);
        }


    }

    private getOneOrderById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundOrder:Order=await this.service.findOneOrderById(id);
            if(foundOrder){
                response.send(foundOrder)
            }
            else {
                next(new ProductNotFoundExceptionn(id));
            }
        }
        catch (error) {
            next(error);
        }



    }





}




export default OrderController;