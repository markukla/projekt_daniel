import { Router } from 'express';
import Service from "./service.interface";
interface Controller<T> {
    path: string;
    router: Router;
    service:Service<T>;

}

export default Controller;