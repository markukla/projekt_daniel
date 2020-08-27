import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongose from 'mongoose';
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers:Controller<any>[]) {
        this.app = express();
        this.app.set('port',5000);


        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    private connectToDatabase() {

    }




    private initializeMiddlewares() {
        this.app.use(bodyParser.json());

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