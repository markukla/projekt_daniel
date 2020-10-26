import HttpException from "../Exceptions/HttpException";
import {NextFunction, Request, Response} from "express";

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const status: number = error.status || 500;
    const messageToUser='Ops something went wrong';
    response
        .status(status)
        .send({
            status,
            message: messageToUser,
            errorMessage:`${error.message}`
        })
}

export default errorMiddleware;