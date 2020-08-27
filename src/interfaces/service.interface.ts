import {getRepository, Repository} from "typeorm";

interface Service<T> {
    repository:Repository<T>;

}
export default Service;