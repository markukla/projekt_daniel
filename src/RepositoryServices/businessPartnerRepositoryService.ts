import {getManager, getRepository} from "typeorm";
import RepositoryService from "../interfaces/service.interface";

import BusinesPartner from "../Models/BusinessPartner/businesPartner.entity";
import CreateBusinessPartnerDto from "../Models/BusinessPartner/businessPartner.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";
import * as bcrypt from "bcrypt";
import ChangePasswordDto from "../authentication/changePassword.dto";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import UpdateBussinessPartnerWithoutPassword from "../Models/BusinessPartner/modyfyBusinessPartent.dto";
import User from "../Models/User/user.entity";

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
        const businesPartnerRoles: Role[]=[new Role(RoleEnum.USER)];
        const hashedPassword = await bcrypt.hash(businessPartnerdata.password, 10);
        const businesPartner = this.manager.create(BusinesPartner,{
            ...businessPartnerdata,
            roles:businesPartnerRoles,
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

    public modifyRecord = async (id:number,businesesPartnerData:UpdateBussinessPartnerWithoutPassword):Promise<BusinesPartner> => {


        // dont allow to change email if email is asigned to other user or businessPartner, becasuse it make proper log in process imposssible
        const userWithThisEmail:User=
            await this.manager.findOne(User,
                {email: businesesPartnerData.email},
                {relations: ['roles']});
        const businesspartnerWithThisEmail:BusinesPartner=await this.manager.findOne(BusinesPartner,
            {email: businesesPartnerData.email},
            {relations: ['roles']}
        );
        const otherUserWithThisEmailAlreadyExist:boolean=(userWithThisEmail&&userWithThisEmail.id!==id);
        const otheBusinessPartnetWithThisEmailAlreadyExist:boolean=(businesspartnerWithThisEmail&&businesspartnerWithThisEmail.id!==id);
        if (otherUserWithThisEmailAlreadyExist||otheBusinessPartnetWithThisEmailAlreadyExist) {
            throw new UserWithThatEmailAlreadyExistsException(businesesPartnerData.email);
        }

        const businessPartner = this.manager.create(BusinesPartner,{
            ...businesesPartnerData,
            id:id

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


        const hashedPassword:string= await bcrypt.hash(passwordData.newPassword,10);
        businessPartner.password= hashedPassword;
        await this.manager.save(BusinesPartner,businessPartner)
    }


}

export default BusinessPartnerService;


