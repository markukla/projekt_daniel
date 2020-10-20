import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getManager, getRepository, UpdateResult} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import Product from "../Models/Products/product.entity";
import ProductNotFoundExceptionn from "../Exceptions/ProductNotFoundException";
import CreateProductDto from "../Models/Products/product.dto";
import ProductAlreadyExistsException from "../Exceptions/ProductAlreadyExistsException";
import Order from "../Models/Order/order.entity";
import CreateOrderDto from "../Models/Order/order.dto";
import UserService from "./userRepositoryService";
import MaterialService from "./materialRepositoryService";
import ProductService from "./productRepositoryService";


class OrderService implements RepositoryService {

    public repository = getRepository(Order);
    public manager=getManager();
    public productRepositoryService=new ProductService();
    public userRepositoryService=new UserService();
    public materialRepositoryService=new MaterialService();

    public async findOneOrderById(id: string): Promise<Order> {
        const foundOrder: Order = await this.repository.findOne(id,{relations:["businessPartner",]});
        if (!foundOrder) {
            throw new ProductNotFoundExceptionn(id);
        }
        return foundOrder;


    }



    public async findAllOrders(): Promise<Order[]> {
        const foundOrders: Order[] = await this.repository.find();

        return foundOrders;

    }

    public async addOneOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        // do not allow to add the same product twice



        const orderToSave: Order = {
           businessPartner:await this.userRepositoryService.findOnePartnerById(createOrderDto.partnerId),
           product:await this.productRepositoryService.findOneProductById(createOrderDto.productId),
            creator:await this.userRepositoryService.findUserById(createOrderDto.creatorId),
            orderDetails:createOrderDto.orderDetails,
            productMaterial:await this.materialRepositoryService.findOneMaterialById(createOrderDto.productId),





        };
        const savedOrder:Order = await this.repository.save(orderToSave);
        return savedOrder;

    }




}

export default OrderService;