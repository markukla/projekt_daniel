import * as express from 'express';
import {getRepository, Repository} from "typeorm";

import PostNotFoundException from "../Exceptions/PostNotFoundException";
import RepositoryService from "../interfaces/service.interface";

import BusinesPartner from "../Models/BusinessPartner/businesPartner.entity";
import CreateBusinessPartnerDto from "../Models/BusinessPartner/businessPartner.dto";

class BusinessPartnerService implements RepositoryService<BusinesPartner>{
    public repository:Repository<BusinesPartner>=getRepository(BusinesPartner);



    public createNewRecord = async (request: express.Request, response: express.Response) => {
        const businessPartnerData: CreateBusinessPartnerDto = request.body;
        const newBusinessPartner = this.repository.create(businessPartnerData);
        await this.repository.save(newBusinessPartner);
        response.send(newBusinessPartner);
    }

    public getAllRecords = async (request: express.Request, response: express.Response) => {
        // in relation option: it takes table name as paramter, not enity name
        const records = await this.repository.find({relations:['roles']});
        response.send(records);
    }

    public findOneRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const businesPartner = await this.repository.findOne(id,{relations:['roles']});
        if (businesPartner) {
            response.send(businesPartner);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public modifyRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const businessPartnerData: BusinesPartner = request.body;
        try {
            // id must be set
            businessPartnerData.business_partner_id=Number(id);
            await this.repository.save( businessPartnerData);

            const updatedBusinessPartner = await this.repository.findOne(id);
            if (updatedBusinessPartner) {
                response.send(updatedBusinessPartner);
            } else {
                next(new PostNotFoundException(id));
            }
        }catch (e) {
            var erroType=e.type;
            var erroMessage=e.message;
            response.send({

                "errorType":`${erroType}`,
                "errorMessage":`${erroMessage}`
            })

        }
    }

    public deleteRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.repository.delete(id);
        console.log(deleteResponse);
        if (deleteResponse.affected===1) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default BusinessPartnerService;


