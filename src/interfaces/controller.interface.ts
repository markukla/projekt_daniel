import { Router } from 'express';
import RepositoryService from "./service.interface";
interface Controller<T> {
    path: string;
    router: Router;
    service:RepositoryService<T>;

}

export default Controller;