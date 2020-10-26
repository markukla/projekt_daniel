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
import OrderDetails from "../Models/OrderDetail/orderDetails.entity";
import OrderNotFoundException from "../Exceptions/OrderNotFoundException";


class OrderService implements RepositoryService {

    public repository = getRepository(Order);
    public manager=getManager();
    public productRepositoryService=new ProductService();
    public userRepositoryService=new UserService();
    public materialRepositoryService=new MaterialService();

    public async findOneOrderById(id: string): Promise<Order> {
        const foundOrder: Order = await this.repository.findOne(id);
        if (!foundOrder) {
            throw new OrderNotFoundException(id);
        }
        return foundOrder;


    }



    public async findAllOrders(): Promise<Order[]> {
        const foundOrders: Order[] = await this.repository.find();

        return foundOrders;

    }

    public async addNewOrder(createOrderDto: CreateOrderDto): Promise<Order> {

        let orderNumber:number=await this.obtainOrderNumberForNewOrder();
        let versionNumber:string =this.getCurrentDateAndTime();
        let totalNumber=`${orderNumber}.${versionNumber}`


        const orderToSave: Order = {
            // it would be good to add only id of related object, because actually they are save, in this version extra quring is required. I need to try to optimize this it time allows !!


            businessPartner:await this.userRepositoryService.findOnePartnerById(createOrderDto.partnerId),
           product:await this.productRepositoryService.findOneProductById(createOrderDto.productId),
            creator:await this.userRepositoryService.findUserById(createOrderDto.creatorId),
            orderDetails:createOrderDto.orderDetails,
            productMaterial:await this.materialRepositoryService.findOneMaterialById(createOrderDto.productId),
            orderVersionRegister:new OrderVersionRegister(), // this entity is saved due to cascade enabled
            data:this.getCurrentDateAndTime(),
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

    public async deleteOrderVersionRegisterById(currentOrderId:string){
       const currentOrder=await this.repository.findOne(currentOrderId,{relations:["orderVersionRegister"]});
       if(!currentOrder){
           throw new OrderNotFoundException(currentOrderId);
       }
       const orderRegisterToDeleteId=currentOrder.orderVersionRegister.id;
       // other query is required to obtain orders in this OrderRegister, it cannot be done by currentOrder.orderVersionRegister.orders due to eager limitations
       const orderRegisterToDeleteObtainedWithDiffrentQuery=await this.manager.findOne(OrderVersionRegister,orderRegisterToDeleteId,{relations:["orders"]})
       const ordersOfOrderRegsterTODelete=orderRegisterToDeleteObtainedWithDiffrentQuery.orders;

/*
cascade removal of orderDetails does not work,
so i manually remove them in loop below. First i remove order, to avoid foreign key violation error.
On the end i remove version register object for given order, to remove all versions of this order

*/

        for(let i=0;i<ordersOfOrderRegsterTODelete.length;i++) {
            await this.manager.remove(Order, ordersOfOrderRegsterTODelete[i]);
            await this.manager.remove(OrderDetails, ordersOfOrderRegsterTODelete[i].orderDetails)
        }


            const deleteResult =await this.manager.remove(OrderVersionRegister,orderRegisterToDeleteObtainedWithDiffrentQuery);

        return deleteResult;

    }
    public async addNewVersionOfOrder(createOrderDto: CreateOrderDto,currentOrderId:string): Promise<Order> {
        const currentOrder:Order=await this.findOneOrderById(currentOrderId);

const registerToUpdate:OrderVersionRegister= currentOrder.orderVersionRegister;

let newOrderVersionNumber=this.getCurrentDateAndTime(); // currentOrder number and currentOrder version number is not given from frond but obtained in the backend
        let newOrderTotalNumber=`${currentOrder.orderNumber}.${newOrderVersionNumber}`;
        const newVersionOfOrderToSaveInRegister: Order = {

            // it would be good to add only id of related object, because actually they are save, in this version extra quring is required. I need to try to optimize this it time allows !!
            businessPartner:await this.userRepositoryService.findOnePartnerById(createOrderDto.partnerId),
            product:await this.productRepositoryService.findOneProductById(createOrderDto.productId),
            creator:await this.userRepositoryService.findUserById(createOrderDto.creatorId),
            orderDetails:createOrderDto.orderDetails,
            productMaterial:await this.materialRepositoryService.findOneMaterialById(createOrderDto.productId),
            orderVersionRegister:registerToUpdate, // the same register as for cureent order
            orderVersionNumber:newOrderVersionNumber,
            orderNumber:currentOrder.orderNumber,  // has the same order number as in curent order, but diffrent version number
            orderTotalNumber:newOrderTotalNumber,
            orderName:createOrderDto.orderName,
            index:createOrderDto.index,
            data:this.getCurrentDateAndTime()


        };


        const savedOrder:Order = await this.repository.save(newVersionOfOrderToSaveInRegister);
        return savedOrder;

    }

    public async obtainOrderNumberForNewOrder():Promise<number>{
        const orderRegisters=await this.findAllOrdersVersionsRegisters();
        let newestOrderNumber:number;
        if(orderRegisters.length>0){
            let newestOrderNumberinDataBase:number=orderRegisters.length+1
       newestOrderNumber=newestOrderNumberinDataBase;
        }
        else {  // no ordersREgistersFound(they are created with addingOrders) which means that it is first order in database

            newestOrderNumber=1;
        }
        return newestOrderNumber;

    }

    public getCurrentDateAndTime():string{
        let now = new Date();
        let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
        let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        let dateAndTimeNow=date+' '+time;
        return dateAndTimeNow;

    }





}

export default OrderService;