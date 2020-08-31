import HttpException from "../Exceptions/HttpException";
import {NextFunction,Request,Response} from "express";

function errorMiddleware(error:HttpException, request:Request, response:Response, next:NextFunction) {
const status:number=error.status||500;
const message:string=error.message||'something went wrong';
response
    .status(status)
    .send({
        status,
        message,
    })
}
export default errorMiddleware;