import HttpException from "./HttpException";

class MaterialNotFoundExceptionn extends HttpException{

    constructor(id?:string,materialCode?:string, materialName?:string) {

        if(id){
            super(404,`Material with id ${id} not found`);
        }
       else if(materialCode){
            super(404,`Material with materialCode= ${materialCode} not found`);
        }
        else if(materialName){
            super(404,`Material with materialName= ${materialName} not found`);
        }

    }
}
export default MaterialNotFoundExceptionn;