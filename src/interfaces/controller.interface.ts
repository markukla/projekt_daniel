import { Router } from 'express';
import RepositoryService from "./service.interface";
interface Controller {
    path: string;
    router: Router;
    service?:RepositoryService;

}

export default Controller;