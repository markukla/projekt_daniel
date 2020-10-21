import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import OrderDetails from "./orderDetails.entity";


class Dimension{


   dimensionId:string;

   dimensionvalue:string; //code and number


    constructor(dimensionId: string, dimensionvalue: string) {
        this.dimensionId = dimensionId;
        this.dimensionvalue = dimensionvalue;
    }
}
export default Dimension;