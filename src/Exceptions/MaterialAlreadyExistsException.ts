import HttpException from "./HttpException";


class MaterialAlreadyExistsException extends HttpException {
    constructor(materialCode?: string,materialName?:string) {
        if(materialCode){
            super(400, `Material with materialCode= ${materialCode} already exists`);
        }
        else if(materialName){
            super(400, `Material with materialName ${materialName} already exists`);
        }

    }
}

export default MaterialAlreadyExistsException;
