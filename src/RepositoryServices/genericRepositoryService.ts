import {BaseEntity, EntityManager, getManager, getRepository, Repository} from "typeorm";
import User from "../Models/Users/user.entity";

class GenericRepositoryService <T extends BaseEntity>{
    /*
    manager:EntityManager=getManager()
    repository:Repository<any>=getRepository(any);

    public getAllRecords = async ():Promise<Users[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const recordss=await this.manager.find(T,{relations: ['roles']});
        return recordss;
    }

    public findOneRecord = async (id: string):Promise<Users> => {


        const foundUser:Users = await this.manager.findOne(Users,id,{relations: ['roles']});
        return foundUser;

    }
*/

}