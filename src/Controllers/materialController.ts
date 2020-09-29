import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";


import User from "../Models/Users/user.entity";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";

import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import UserService from "../RepositoryServices/userRepositoryService";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import ChangePasswordDto from "../authentication/changePassword.dto";
import UpdatePrivilegedUserWithouTPasswordDto from "../Models/Users/PrivilegedUsers/modyfyUser.dto";
import Material from "../Models/Materials/material.entity";
import MaterialService from "../RepositoryServices/materialRepositoryService";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";



class MaterialController implements Controller<Material>{
    public path = '/materials';
    public router = express.Router();
    public  service:MaterialService=new MaterialService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware,adminAuthorizationMiddleware,this.getAllMaterials);
        this.router.get(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.getOneMaterialById);
        this.router.patch(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreatePrivilegedUserDto, true), this.updateMaterialById);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneMaterialById);
        this.router.post(this.path,authMiddleware,adminAuthorizationMiddleware,validationMiddleware(CreatePrivilegedUserDto), this.addOneMaterial);
    }

    private addOneMaterial = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const materialData: CreateMaterialDto = request.body;
        try {
            const material:Material = await this.service.addOneMaterial(materialData);

            response.send(material);
        } catch (error) {
            next(error);
        }
    }


    private updateMaterialById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const materialData:CreateMaterialDto=request.body;
        const id:string=request.params.id;
        try {
            const updatedMaterial = await this.service.updateMaterialById(id, materialData);
            if(updatedMaterial){
                response.send(updatedMaterial)}
            else {next(new MaterialNotFoundExceptionn(id));

            }
        }
        catch (error) {
            next(error);
        }

    }

    private getAllMaterials = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const materials:Material[]=await this.service.findAllMaterials();

            /*
            one way to hide information which sholul be removed from final endpoint:
            users.forEach(user=>{
                user.code=undefined;
                user.businesPartnerCompanyName=undefined;
                user.roles=undefined;
                user.id=undefined;
                user.password=undefined;
            });
        */
            response.send(materials);


        }
        catch (error) {
            next(error);
        }


    }

    private getOneMaterialById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundMaterial=await this.service.findOneMaterialById(id);
            if(foundMaterial){
                response.send(foundMaterial)
            }
            else {
                next(new MaterialNotFoundExceptionn(id));
            }
        }
        catch (error) {
            next(error);
        }



    }
    private deleteOneMaterialById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const deleTedResponse=await this.service.deleteMaterialById(id);
            if(deleTedResponse.affected===1){
                response.send({
                    status:200,
                    message:`material with id= ${id} has beeen removed`
                })
            }
            else {
                next(new MaterialNotFoundExceptionn(id));
            }
        }
        catch (error) {
            next(error);
        }

    }





}

export default MaterialController;