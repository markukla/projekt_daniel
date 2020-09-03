import * as express from 'express';
import {getManager, getRepository, Repository} from "typeorm";

import PostNotFoundException from "../Exceptions/PostNotFoundException";
import RepositoryService from "../interfaces/service.interface";

import BusinesPartner from "../Models/BusinessPartner/businesPartner.entity";
import CreateBusinessPartnerDto from "../Models/BusinessPartner/businessPartner.dto";
import CreateUserDto from "../Models/User/user.dto";
import User from "../Models/User/user.entity";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";
import * as bcrypt from "bcrypt";
import ChangePasswordDto from "../authentication/changePassword.dto";

class BusinessPartnerService implements RepositoryService{

    public manager=getManager();
    public repository=getRepository(BusinesPartner);




    public async register(businessPartnerdata: CreateBusinessPartnerDto):Promise<BusinesPartner> {
        if (

            await this.manager.findOne(BusinesPartner,
                {email: businessPartnerdata.email},
                {relations: ['roles']}
            )
        ) {
            throw new UserWithThatEmailAlreadyExistsException(businessPartnerdata.email);
        }
        const hashedPassword = await bcrypt.hash(businessPartnerdata.password, 10);
        const businesPartner = this.manager.create(BusinesPartner,{
            ...businessPartnerdata,
            password: hashedPassword,
        });
        await this.manager.save(businesPartner);
        businesPartner.password = undefined;

        return businesPartner;
    }


    public getAllRecords = async ():Promise<BusinesPartner[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const recordss=await this.manager.find(BusinesPartner,{relations: ['roles']});
        return recordss;
    }

    public findOneRecord = async (id: string):Promise<BusinesPartner> => {


        const foundPartner:BusinesPartner = await this.manager.findOne(BusinesPartner,id,{relations: ['roles']});
        return foundPartner;

    }

    public modifyRecord = async (id:number,businesesPartnerData:BusinesPartner):Promise<BusinesPartner> => {

        businesesPartnerData.business_partner_id = Number(id);
        if (
            await this.manager.findOne(BusinesPartner,
                {email: businesesPartnerData.email},
                {relations: ['roles']}
            )
        ) {
            throw new UserWithThatEmailAlreadyExistsException(businesesPartnerData.email);
        }
        const hashedPassword = await bcrypt.hash(businesesPartnerData.password, 10);
        const businessPartner = this.manager.create(BusinesPartner,{
            ...businesesPartnerData,
            password: hashedPassword,
        });
        await this.manager.save(businessPartner);

        const updatedPartner = await  this.manager.findOne(BusinesPartner,id,{relations: ['roles']});
updatedPartner.password=undefined;
        return updatedPartner;

    }

    public deleteRecord = async (id:number) => {

        const deleteResponse = await this.manager.delete(BusinesPartner,id);
        return deleteResponse;

    }
    public changeUserPasswordByEditor=async (businessPartner:BusinesPartner, passwordData:ChangePasswordDto)=>{


        var hashedPassword:string= await bcrypt.hash(passwordData.newPassword,10);
        businessPartner.password= hashedPassword;
        await this.manager.save(BusinesPartner,businessPartner)
    }


}

export default BusinessPartnerService;


