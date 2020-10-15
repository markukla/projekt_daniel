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
const helpers = require('./helpers');


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
        this.app.use(express.static(__dirname + '/public'));
        this.app.set('views', path.join(__dirname, 'views'))
        this.app.set('view engine', 'ejs')
        this.app.use(bodyParser.json());
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
    private initializeImageUploadController(){
        // initialize storage image location

        const handleError = (err:Error, res:express.Response) => {
            res
                .status(500)
                .contentType("text/plain")
                .end("Oops! Something went wrong!");
        };

        const upload = multer({
            dest: "./uploads"
            // you might also want to set some limits: https://github.com/expressjs/multer#limits

        });
        this.app.get('/uploadPicture', (req, res,next) => {
            res.render('addProduct');
        });

        this.app.post(
            "/upload",
            upload.single("file" /* name attribute of <file> element in your form */),
            (req:express.Request, res:express.Response) => {
                const tempPath = req.file.path;
                const fileName=req.file.originalname;
                const targetPath = path.join(__dirname, `./uploads/${fileName}`);

                if (path.extname(req.file.originalname).toLowerCase() === ".png") {
                    fs.rename(tempPath, targetPath, err => {
                        if (err) return handleError(err, res);

                        res
                            .status(200)
                            .contentType("text/plain")
                            .end("File uploaded!");
                    });
                } else {
                    fs.unlink(tempPath, err => {
                        if (err) return handleError(err, res);

                        res
                            .status(403)
                            .contentType("text/plain")
                            .end("Only .png files are allowed!");
                    });
                }
            }
        );

        }





    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
}

export default App;