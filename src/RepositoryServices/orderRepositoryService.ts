import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getManager, getRepository, Timestamp, UpdateResult} from "typeorm";
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
import OrderVersionRegister from "../Models/OrderVersionRegister/orderVersionRegister.entity";


class OrderService implements RepositoryService {

    public repository = getRepository(Order);
    public manager=getManager();
    public productRepositoryService=new ProductService();
    public userRepositoryService=new UserService();
    public materialRepositoryService=new MaterialService();

    public async findOneOrderById(id: string): Promise<Order> {
        const foundOrder: Order = await this.repository.findOne(id);
        if (!foundOrder) {
            throw new ProductNotFoundExceptionn(id);
        }
        return foundOrder;


    }



    public async findAllOrders(): Promise<Order[]> {
        const foundOrders: Order[] = await this.repository.find();

        return foundOrders;

    }

    public async addNewOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        // do not allow to add the same product twice

        let orderNumber:number=await this.obtainOrderNumberForNewOrder();
        let versionNumber:string =this.getCurentDateAndTime();



        let totalNumber=`${orderNumber}.${versionNumber}`
        const orderToSave: Order = {
            // it would be good to add only id of related object, because actually they are save, in this version extra quring is required. I need to try to optimize this it time allows !!


            businessPartner:await this.userRepositoryService.findOnePartnerById(createOrderDto.partnerId),
           product:await this.productRepositoryService.findOneProductById(createOrderDto.productId),
            creator:await this.userRepositoryService.findUserById(createOrderDto.creatorId),
            orderDetails:createOrderDto.orderDetails,
            productMaterial:await this.materialRepositoryService.findOneMaterialById(createOrderDto.productId),
            orderVersionRegister:new OrderVersionRegister(), // this entity is saved due to cascade enabled
            data:this.getCurentDateAndTime(),
            index:createOrderDto.index,
            orderName:createOrderDto.orderName,
            orderNumber:await this.obtainOrderNumberForNewOrder(),
            orderTotalNumber:totalNumber,
            orderVersionNumber:versionNumber

        };
        const savedOrder:Order = await this.repository.save(orderToSave);
        return savedOrder;

    }
    public async findOrderVersionRegisterById(id:string):Promise<OrderVersionRegister>{
      const foundRegister=  await this.manager.findOne(OrderVersionRegister,id);
      return foundRegister
    }
    public async findAllOrdersVersionsRegisters():Promise<OrderVersionRegister[]>{
        const ordersRegisters=await this.manager.find(OrderVersionRegister,{relations:["orders"]});
        return ordersRegisters;
    }
    public async findAllCurentVerionsOfOrder():Promise<Order[]>{
        const ordersRegisters= await this.findAllOrdersVersionsRegisters();
        let currentOrders:Order[]=[];

            ordersRegisters.forEach(rg=>{
               currentOrders.push(rg.orders[rg.orders.length-1]);

        });
            return currentOrders;

    }

    public async deleteOrderVersionRegisterById(currentOrderId:string):Promise<DeleteResult>{
       const currentOrder=await this.findOneOrderById(currentOrderId);

       const orderRegisterToDeleteId=String(currentOrder.orderVersionRegister.id);
       const deleteResult:DeleteResult=await this.manager.delete(OrderVersionRegister,orderRegisterToDeleteId);
        return deleteResult;

    }
    public async addNewVersionOfOrder(createOrderDto: CreateOrderDto,currentOrderId:string): Promise<Order> {
        const order:Order=await this.findOneOrderById(currentOrderId);

const registerToUpdate:OrderVersionRegister= order.orderVersionRegister;
        const orderRegisterNumber:number=registerToUpdate.id // asume that newest version will be lase elemnet in database table
let newOrderVersionNumber=this.getCurentDateAndTime(); // order number and order version number is not given from frond but obtained in the backend
        let newOrderTotalNumber=`${orderRegisterNumber}.${newOrderVersionNumber}`;
        const newVersionOfOrderToSaveInRegister: Order = {

            // it would be good to add only id of related object, because actually they are save, in this version extra quring is required. I need to try to optimize this it time allows !!
            businessPartner:await this.userRepositoryService.findOnePartnerById(createOrderDto.partnerId),
            product:await this.productRepositoryService.findOneProductById(createOrderDto.productId),
            creator:await this.userRepositoryService.findUserById(createOrderDto.creatorId),
            orderDetails:createOrderDto.orderDetails,
            productMaterial:await this.materialRepositoryService.findOneMaterialById(createOrderDto.productId),
            orderVersionRegister:registerToUpdate,
            orderVersionNumber:newOrderVersionNumber,
            orderNumber:orderRegisterNumber,
            orderTotalNumber:newOrderTotalNumber,
            orderName:createOrderDto.orderName,
            index:createOrderDto.index,
            data:this.getCurentDateAndTime()


        };


        const savedOrder:Order = await this.repository.save(newVersionOfOrderToSaveInRegister);
        return savedOrder;

    }

    public async obtainOrderNumberForNewOrder():Promise<number>{
        const orderRegisters=await this.findAllOrdersVersionsRegisters();
        let newestOrderNumber:number;
        if(orderRegisters.length>0){
            let newestOrderNumberinDataBase:number=orderRegisters[orderRegisters.length-1].id;
       newestOrderNumber=newestOrderNumberinDataBase+1;
        }
        else {  // no ordersREgistersFound(they are created with addingOrders) which means that it is first order in database

            newestOrderNumber=1;
        }
        return newestOrderNumber;

    }

    public getCurentDateAndTime():string{
        let now = new Date();
        let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
        let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        let dateAndTimeNow=date+' '+time;
        return dateAndTimeNow;

    }





}

export default OrderService;