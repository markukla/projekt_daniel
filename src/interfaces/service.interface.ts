import {EntityManager, getRepository, Repository} from "typeorm";

interface RepositoryService {

    manager?:EntityManager;
    repository:Repository<any>;


}
export default RepositoryService;