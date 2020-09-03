import {EntityManager, getRepository, Repository} from "typeorm";

interface RepositoryService {

    manager:EntityManager;


}
export default RepositoryService;