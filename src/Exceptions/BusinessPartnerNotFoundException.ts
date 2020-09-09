import HttpException from "./HttpException";

class BusinessPartnerNotFoundException extends HttpException{

    constructor(id:string) {
        super(404,`Business Partner with id ${id} not found`);
    }
}
export default BusinessPartnerNotFoundException;