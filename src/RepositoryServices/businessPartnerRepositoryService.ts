import {getManager, getRepository} from "typeorm";
import RepositoryService from "../interfaces/service.interface";

import CreateBusinessPartnerDto from "../Models/BusinessPartner/businessPartner.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";
import * as bcrypt from "bcrypt";
import ChangePasswordDto from "../authentication/changePassword.dto";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import UpdateBussinessPartnerWithoutPassword from "../Models/BusinessPartner/modyfyBusinessPartent.dto";
import User from "../Models/User/user.entity";
import validatePassword from "../authentication/validate.password";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import BusinessPartnerNotFoundException from "../Exceptions/BusinessPartnerNotFoundException";

class BusinessPartnerService implements RepositoryService{

    public manager=getManager();





    public async register(businessPartnerdata: CreateBusinessPartnerDto):Promise<User> {
        if (

            await this.manager.findOne(User,
                {email: businessPartnerdata.email},
                {relations: ['roles']}
            )
        ) {
            throw new UserWithThatEmailAlreadyExistsException(businessPartnerdata.email);
        }
        const businesPartnerRoles: Role[]=[new Role(RoleEnum.USER)];
        const isPartner=true;
        const isAdmin=false;
        const hashedPassword = await bcrypt.hash(businessPartnerdata.password, 10);
        const businesPartner = this.manager.create(User,{
            ...businessPartnerdata,
            roles:businesPartnerRoles,
            password: hashedPassword,
            isPartner:isPartner,
            isAdmin:isAdmin
        });
        await this.manager.save(businesPartner);
        businesPartner.password = undefined;

        return businesPartner;
    }


    public getAllRecords = async ():Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers:User[]=await this.manager.find(User,{relations: ['roles']});
        const businesPartners:User[]=[];
        allUsers.forEach(user =>{
            if(user.isPartner){
                businesPartners.push(user);
            }
        } );
        return businesPartners;
    }

    public findOneRecord = async (id: string):Promise<User> => {


        const foundPartner:User = await this.manager.findOne(User,id,{relations: ['roles']});
        if(!foundPartner){
            throw new BusinessPartnerNotFoundException(String(id));
        }
        if(foundPartner.isPartner){
            return foundPartner;
        }
        else {
            new BusinessPartnerNotFoundException(String(id));
        }


    }

    public modifyRecord = async (id:number,businesesPartnerData:UpdateBussinessPartnerWithoutPassword):Promise<User> => {
        let partnerToupdate:User=await this.manager.findOne(User,id);
        if (!partnerToupdate) {
            throw new BusinessPartnerNotFoundException(String(id));

        }
        const userWiththisIdIsNotBusinessPartner:boolean=partnerToupdate.isPartner===false;
        if(userWiththisIdIsNotBusinessPartner){
            throw new BusinessPartnerNotFoundException(String(id));
        }


        // dont allow to change email if email is asigned to other user or businessPartner, becasuse it make proper log in process imposssible
        const userWithThisEmail:User=
            await this.manager.findOne(User,
                {email: businesesPartnerData.email},
                {relations: ['roles']});

        const otherUserWithThisEmailAlreadyExist:boolean=(userWithThisEmail&&userWithThisEmail.id!==id);
        if (otherUserWithThisEmailAlreadyExist) {
            throw new UserWithThatEmailAlreadyExistsException(businesesPartnerData.email);
        }

        const businessPartner = this.manager.create(User,{
            ...businesesPartnerData,
            id:id

        });
        await this.manager.save(businessPartner);

        const updatedPartner = await  this.manager.findOne(User,id,{relations: ['roles']});
updatedPartner.password=undefined;
        return updatedPartner;

    }

    public deleteRecord = async (id:number) => {

        const deleteResponse = await this.manager.delete(User,id);
        return deleteResponse;

    }
    public changeUserPasswordByEditor=async (businessPartner:User, passwordData:ChangePasswordDto):Promise<User>=>{

const validatedPassword=validatePassword(passwordData.newPassword);
        const hashedPassword:string= await bcrypt.hash(validatedPassword,10);
        businessPartner.password= hashedPassword;
        await this.manager.save(User,businessPartner)
        const updatedBusinessParter=await this.manager.findOne(User,businessPartner.id);
        return updatedBusinessParter;
    }


}

export default BusinessPartnerService;


