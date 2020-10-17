import * as express from 'express';
import * as bodyParser from 'body-parser';

import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
const multer = require("multer");

const path = require('path');



class App {
    public app: express.Application;
    public port: number;

    constructor(controllers:Controller[]) {
        this.app = express();

       


        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    private connectToDatabase() {

    }
    public getServer() {
        return this.app;
    }




    private initializeMiddlewares() {
        this.app.use(express.static(__dirname + '../public'));
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());

    }

    private initializeControllers(controllers:Controller[]) {
        controllers.forEach(controller=>{
            this.app.use('/', controller.router);
        });




    }
    private initializeErrorHandling(){
        this.app.use(errorMiddleware);
    }





    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
}

export default App;