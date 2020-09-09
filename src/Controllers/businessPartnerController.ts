import * as express from 'express';

import Controller from 'interfaces/controller.interface';
import validationMiddleware from "../middleware/validation.middleware";

import BusinessPartnerService from "../RepositoryServices/businessPartnerRepositoryService";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import ChangePasswordDto from "../authentication/changePassword.dto";
import CreateBusinessPartnerDto from "../Models/BusinessPartner/businessPartner.dto";
import authMiddleware from "../middleware/auth.middleware";
import editorAuthorizationMiddleware from "../middleware/editorAuthorizationMiddleware";
import User from "../Models/User/user.entity";
import UpdateBussinessPartnerWithoutPassword from "../Models/BusinessPartner/modyfyBusinessPartent.dto";



class BusinessPartnerController implements Controller<User>{
    public path = '/business_partners';
    public router = express.Router();
    public  service:BusinessPartnerService=new BusinessPartnerService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path,authMiddleware,editorAuthorizationMiddleware, this.getAllPartners);
        this.router.get(`${this.path}/:id`,authMiddleware,editorAuthorizationMiddleware, this.getOnePartnerById);
        this.router.patch(`${this.path}/:id`,authMiddleware,editorAuthorizationMiddleware, validationMiddleware(CreateBusinessPartnerDto, true), this.modyfyPartner);
        this.router.delete(`${this.path}/:id`,authMiddleware,editorAuthorizationMiddleware, this.deleteOnePartnerById);
        this.router.patch(`${this.path}/:id/changepassword`,authMiddleware,editorAuthorizationMiddleware, validationMiddleware(ChangePasswordDto, true), this.changePasswordByEditor);

        this.router.post(this.path,validationMiddleware(CreateBusinessPartnerDto), this.registration);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const businessPartnerData: CreateBusinessPartnerDto = request.body;
        try {
            const user = await this.service.register(businessPartnerData);

            response.send(user);
        } catch (error) {
            next(error);
        }
    }


    private modyfyPartner = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const partnerData:UpdateBussinessPartnerWithoutPassword=request.body;
        const id:number=Number(request.params.id);
        try {
            const modyfiedPartner = await this.service.modifyRecord(id, partnerData);
            if(modyfiedPartner){
                response.send(modyfiedPartner)}
            else {next(new UserNotFoundException(String(id)));

            }
        }
        catch (error) {
            next(error);
        }

    }

    private getAllPartners = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const businesParners:User[]=await this.service.getAllRecords();
            response.send(businesParners);


        }
        catch (error) {
            next(error);
        }


    }

    private getOnePartnerById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundPartner=await this.service.findOneRecord(id);
            if(foundPartner){
                response.send(foundPartner)
            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }



    }
    private deleteOnePartnerById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:number=Number(request.params.id);
        try{
            const deleTedResponse=await this.service.deleteRecord(id);
            if(deleTedResponse.affected===1){
                response.send({
                    status:200,
                    message:`business partner with id= ${id} has beeen removed`
                })
            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }

    }

    private changePasswordByEditor = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const businesPartner=await this.service.findOneRecord(id);
            if(businesPartner){
                const passwordData:ChangePasswordDto=request.body;
              await this.service.changeUserPasswordByEditor(businesPartner,passwordData);
                response.send({status:200,
                    message:"password has been successfully updated"})

            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }



    }




}

export default BusinessPartnerController;