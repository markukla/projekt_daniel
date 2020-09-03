import {BaseEntity, EntityManager, getManager, getRepository, Repository} from "typeorm";
import User from "../Models/User/user.entity";

class GenericRepositoryService <T extends BaseEntity>{
    /*
    manager:EntityManager=getManager()
    repository:Repository<any>=getRepository(any);

    public getAllRecords = async ():Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const recordss=await this.manager.find(T,{relations: ['roles']});
        return recordss;
    }

    public findOneRecord = async (id: string):Promise<User> => {


        const foundUser:User = await this.manager.findOne(User,id,{relations: ['roles']});
        return foundUser;

    }
*/

}