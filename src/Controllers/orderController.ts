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
import {DeleteResult} from "typeorm";
import OrderVersionRegister from "../Models/OrderVersionRegister/orderVersionRegister.entity";
import OrderNotFoundException from "../Exceptions/OrderNotFoundException";
const path = require('path');



class OrderController implements Controller {
    public path = '/orders';
    public router = express.Router();
    public service: OrderService = new OrderService();


    constructor() {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router.get(this.path, this.getAllOrders);
        this.router.get(`${this.path}/currents`, this.getAllCurentVersionOfOrders);
        this.router.post(this.path, validationMiddleware(CreateOrderDto), this.addNewOrder)
        this.router.post(`${this.path}/currents/:id/newVersion`, this.addNewVersionOfOrder);
        this.router.delete(`${this.path}/currents/:id`, this.removeCurrentOrderAndVersionRegister);
        this.router.get(`${this.path}/currents/:partnerCode`, this.findAllCurentVerionsOfOrderForGivenPartnerCode);
        this.router.get(`${this.path}/currents/partner/:id`, this.findAllCurentVerionsOfOrderForGivenPartneId);

        this.router.get(`${this.path}/:id`, this.getOneOrderById);
        //remeber to add authentication admin authorization middleware after tests


    }

    private addNewOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const orderData: CreateOrderDto = req.body;
        console.log(orderData);


        try {
            const order: Order = await this.service.addNewOrder(orderData); // it is probably wrong path

            res.send({
                message: "new Order added:",
                order: order
            });
        } catch (error) {
            console.log(`${error.message}`)
            next(error);
        }
    }
    private addNewVersionOfOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const orderData: CreateOrderDto = req.body;


        try {
            const order: Order = await this.service.addNewVersionOfOrder(orderData, req.params.id); // it is probably wrong path

            res.send({
                message: "new order version added:",
                order: order
            });
        } catch (error) {
            next(error);
        }
    }


    private getAllOrders = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const orders: Order[] = await this.service.findAllOrders();


            response.send(orders);


        } catch (error) {
            next(error);
        }


    }

    private getOneOrderById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const foundOrder: Order = await this.service.findOneOrderById(id);
            response.send(foundOrder);

        } catch (error) {
            next(error);
        }


    }


    private getAllCurentVersionOfOrders = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const orders: Order[] = await this.service.findAllCurentVerionsOfOrder();


            response.send(orders);


        } catch (error) {
            next(error);
        }


    }
    private removeCurrentOrderAndVersionRegister = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        try {
            const curerntOrderid: string = request.params.id;
            const currentOrder = await this.service.findOneOrderById(curerntOrderid);

            const versionRegisterId = String(currentOrder.orderVersionRegister.id);
            const deletedOrderRegister: OrderVersionRegister = await this.service.deleteOrderVersionRegisterById(versionRegisterId);
            if (deletedOrderRegister) {
                response.send({
                    status: 200,
                    message: 'order and its version history removed'
                });
            } else {
                response.send({
                    status: 500,
                    message: 'Ops something went wrong, could not remove order'
                });
            }
        } catch (error) {
            next(error);
        }


    }


    private findAllCurentVerionsOfOrderForGivenPartnerCode = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
try{
        const partnerCode:string=request.params.partnerCode;
        console.log(`${partnerCode}`);

        const ordersforOnePartner:Order[]=await this.service.findAllCurentVerionsOfOrderForGivenPartnerCode(partnerCode);


        response.send(ordersforOnePartner);


    }
    catch (error) {
    next(error);
    }

    }


    private findAllCurentVerionsOfOrderForGivenPartneId = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try{
            const id:string=request.params.id;


            const ordersforOnePartner:Order[]=await this.service.findAllCurentVerionsOfOrderForGivenPartnerId(id);


            response.send(ordersforOnePartner);


        }
        catch (error) {
            next(error);
        }

    }

}

export default OrderController;
