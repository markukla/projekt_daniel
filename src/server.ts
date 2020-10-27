
import App from './app';

import 'dotenv/config';
import 'reflect-metadata';
import {createConnection} from 'typeorm';
import validateEnv from "./utils/vaildateEnv";
import UserController from "./Controllers/userController";
import RoleController from "./Controllers/roleController";
import AuthenticationController from "./authentication/authentication.controller";
import BusinessPartnerController from "./Controllers/businessPartnerController";
import {config, config_test} from "../ormconfig";
import {connectToDatabase} from "./utils/DatabaseUtil/manageDatabaseConnection";
import MaterialController from "./Controllers/materialController";
import ProductController from "./Controllers/productController";
import OrderController from "./Controllers/orderController";
import ProductTypeController from "./Models/Products/productTypeController";
import ProductTopController from "./Models/Products/productTopController";
import ProductBottomController from "./Models/Products/productBottomController";

validateEnv();


validateEnv();

(async () => {
    try {
        await connectToDatabase(config);
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = new App(
        [
            new RoleController(),
            new AuthenticationController(),
            new UserController(),
            new BusinessPartnerController(),
            new MaterialController(),
            new ProductController(),
            new OrderController(),
            new ProductTypeController(),
            new ProductTopController(),
            new ProductBottomController()



        ],
    );
    app.listen();
})();
