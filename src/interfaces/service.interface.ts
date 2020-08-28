import {getRepository, Repository} from "typeorm";

interface RepositoryService<T> {
    repository:Repository<T>;

}
export default RepositoryService;