import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import CreateProductTypeDto from "./createProductType.dto";

import validationMiddleware from "../../middleware/validation.middleware";
import ProductTopService from "./ProductTopRepository";
import CreateProductTopDto from "./createProductTop.dto";
import ProductTop from "./productTop.entity";
import ProductTopNotFoundException from "../../Exceptions/ProductTopNotFoundException";
import ProductBottomService from "./productBottomRepository";
import CreateProductBottomDto from "./createProductBottom.dto";
import ProductBottom from "./productBottom.entity";
import ProductBottomNotFoundException from "../../Exceptions/ProductBottomNotFoundException";


class ProductBottomController implements Controller {
    public path = '/productBottoms';
    public router = express.Router();
    public service: ProductBottomService = new ProductBottomService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllProductBottoms);
        this.router.get(`${this.path}/:id`, this.getOneProductBottomById);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CreateProductTypeDto, true), this.updateProductTypeById);
        this.router.delete(`${this.path}/:id`, this.deleteOneProductBottomById);
        this.router.post(this.path, validationMiddleware(CreateProductTypeDto), this.addOneProductBottom);
    }

    private addOneProductBottom = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productBottomData: CreateProductBottomDto = request.body;
        try {
            const productBottom: ProductBottom = await this.service.addOneProductBottom(productBottomData);

            response.send(productBottom);
        } catch (error) {
            next(error);
        }
    }


    private updateProductTypeById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productBottom: CreateProductBottomDto = request.body;
        const id: string = request.params.id;
        try {
            const updatedProductBottom = await this.service.updateProductBottomById(id, productBottom);

            response.send({
                message:"Product Bottom updated",
                updatedProductBottom:updatedProductBottom
            });
        } catch (error) {
            next(error);
        }

    }

    private getAllProductBottoms = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const productBottoms: ProductBottom[] = await this.service.findAllProductsBottoms();


            response.send(productBottoms);


        } catch (error) {
            next(error);
        }


    }

    private getOneProductBottomById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const foundProductBottom:ProductBottom = await this.service.findOneProductBottomById(id);
            if (foundProductBottom) {
                response.send(foundProductBottom)
            } else {
                next(new ProductBottomNotFoundException(id));
            }
        } catch (error) {
            next(error);
        }


    }
    private deleteOneProductBottomById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const deleTedResponse = await this.service.deleteProductBottomById(id);
            if (deleTedResponse.affected === 1) {
                response.send({
                    status: 200,
                    message: `ProductBottom with id= ${id} has beeen removed`
                })
            } else {
                next(new ProductBottomNotFoundException(id));
            }
        } catch (error) {
            next(error);
        }

    }


}

export default ProductBottomController;
