import Controller from "../interfaces/controller.interface";
import * as express from "express";
import * as fs from "fs";
import* as  multer from "multer";
import * as path from "path";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateMaterialDto from "../Models/Materials/material.dto";

class DrawingUploadController implements Controller{
    public path = '/uploadDrawing';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }
    public upload = multer({
        dest: "../../public/images"
        // you might also want to set some limits: https://github.com/expressjs/multer#limits

    });


    private handleError=(err:Error, res:express.Response) => {
        res
            .status(500)
            .contentType("text/plain")
            .end("Oops! Something went wrong!");
    };
    private initializeRoutes() {
        this.router.get(this.path,this.getUpladDrawingForm ); // remember to add authorization middlewares
        this.router.post(this.path,this.upload.single("file"), (req:express.Request, res:express.Response) => {
                const tempPath = req.file.path;
                const fileName=req.file.originalname;
                const targetPath = path.join(__dirname, `../../public/images/${fileName}`);

                if (path.extname(req.file.originalname).toLowerCase() === ".png") {
                    fs.rename(tempPath, targetPath, err => {
                        if (err) return this.handleError(err, res);

                        res
                            .status(200)
                            .contentType("text/plain")
                            .end("File uploaded!");
                    });
                } else {
                    fs.unlink(tempPath, err => {
                        if (err) return this.handleError(err, res);

                        res
                            .status(403)
                            .contentType("text/plain")
                            .end("Only .png files are allowed!");
                    });
                }
            }
        )
    }

    private getUpladDrawingForm=async (request: express.Request, response: express.Response, next: express.NextFunction)=> {
        return  response.render('addProduct');

    }




}
export default DrawingUploadController;