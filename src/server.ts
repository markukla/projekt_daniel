import App from './app';
import PostsController from "./Controllers/postController";
import 'dotenv/config';
import 'reflect-metadata';
import config from "../ormconfig";
import {createConnection} from 'typeorm';
import validateEnv from "../utils/vaildateEnv";
import UserController from "./Controllers/userController";
import RoleController from "./Controllers/roleController";
import AuthenticationController from "./authentication/authentication.controller";
validateEnv();


validateEnv();

(async () => {
    try {
        await createConnection(config);
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = new App(
        [
            new AuthenticationController(),
            new PostsController(),new UserController(),new RoleController()
        ],
    );
    app.listen();
})();