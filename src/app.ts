import * as express from 'express';
import * as bodyParser from 'body-parser';
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';
import * as cookieParser from "cookie-parser";

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers:Controller<any>[]) {
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
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());

    }

    private initializeControllers(controllers:Controller<any>[]) {
        controllers.forEach(controller=>{
            this.app.use('/', controller.router);
        })



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