import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import CreateProductTypeDto from "./createProductType.dto";

import validationMiddleware from "../../middleware/validation.middleware";
import ProductTopService from "./ProductTopRepository";
import CreateProductTopDto from "./createProductTop.dto";
import ProductTop from "./productTop.entity";
import ProductTopNotFoundException from "../../Exceptions/ProductTopNotFoundException";


class ProductTopController implements Controller {
    public path = '/productTops';
    public router = express.Router();
    public service: ProductTopService = new ProductTopService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllProductTopes);
        this.router.get(`${this.path}/:id`, this.getOneProductTopById);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CreateProductTopDto, true), this.updateProductTypeById);
        this.router.delete(`${this.path}/:id`, this.deleteOneProductTypeById);
        this.router.post(this.path, validationMiddleware(CreateProductTopDto), this.addOneProductTope);
    }

    private addOneProductTope = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productTopData: CreateProductTopDto = request.body;
        try {
            const productTop: ProductTop = await this.service.addOneProductTope(productTopData);

            response.send(productTop);
        } catch (error) {
            next(error);
        }
    }


    private updateProductTypeById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productTOp: CreateProductTopDto = request.body;
        const id: string = request.params.id;
        try {
            const updatedProductTop = await this.service.updateProductTopById(id, productTOp);

            response.send({
                message:"Product Top updated",
                updatedProductTop:updatedProductTop
            });
        } catch (error) {
            next(error);
        }

    }

    private getAllProductTopes = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const productTops: ProductTop[] = await this.service.findAllProductsTops();


            response.send(productTops);


        } catch (error) {
            next(error);
        }


    }

    private getOneProductTopById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const foundProductTop = await this.service.findOneProductTopById(id);
            if (foundProductTop) {
                response.send(foundProductTop)
            } else {
                next(new ProductTopNotFoundException(id));
            }
        } catch (error) {
            next(error);
        }


    }
    private deleteOneProductTypeById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const deleTedResponse = await this.service.deleteProductTopById(id);
            if (deleTedResponse.affected === 1) {
                response.send({
                    status: 200,
                    message: `ProductTop with id= ${id} has beeen removed`
                })
            } else {
                next(new ProductTopNotFoundException(id));
            }
        } catch (error) {
            next(error);
        }

    }


}

export default ProductTopController;
