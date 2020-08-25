import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongose from 'mongoose';
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import 'reflect-metadata';
import 'es6-shim';

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers:Controller[], port) {
        this.app = express();
        this.port = port;
        this.connectToDatabase()
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    private connectToDatabase(){
        const databaseName='baza_projekt_daniel';

const mongoose=mongose;
        mongoose
       // using `` instead of '' or "" we can easily add variable values to string variable

            .connect(`mongodb://localhost/${databaseName}`, { useNewUrlParser: true,useFindAndModify: false
                 })
            .then(() => console.log("Connected to MongoDB..."))
            .catch(err => console.error("Could not connect to MongoDB..."));


    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());

    }

    private initializeControllers(controllers) {
        controllers.forEach(controller=>{
            this.app.use('/', controller.router);
        })



    }
    private initializeErrorHandling(){
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;