import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getRepository} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";


class MaterialService implements RepositoryService{

    public repository=getRepository(Material);

    public async findOneMaterialById(id:string):Promise<Material>{
        const foundMaterial:Material=await this.repository.findOne(id);
        if(!foundMaterial){
            throw new MaterialNotFoundExceptionn(id);
        }
        return foundMaterial;


    }
    public async findOneMaterialByMaterialCode(materialCode:string):Promise<Material>{
        const foundMaterial:Material=await this.repository.findOne({materialCode:materialCode});
        if(!foundMaterial){
            throw new MaterialNotFoundExceptionn(materialCode);
        }
        return foundMaterial;


    }
    public async findOneMaterialByMaterialName(materialName:string):Promise<Material>{
        const foundMaterial:Material=await this.repository.findOne({materialName:materialName});
        if(!foundMaterial){
            throw new MaterialNotFoundExceptionn(materialName);
        }
        return foundMaterial;


    }

    public async findAllMaterials():Promise<Material[]>{
        const foundMaterials:Material[]=await this.repository.find();

        return foundMaterials;

    }
    public async addOneMaterial(createMaterialDto:CreateMaterialDto):Promise<Material>{
        const materialWithThisCodeInDatabase=await this.findOneMaterialByMaterialCode(createMaterialDto.materialCode);
        const materialWithThisNameInDatabase=await this.findOneMaterialByMaterialName(createMaterialDto.materialName);
        if(materialWithThisCodeInDatabase){
            throw new MaterialAlreadyExistsException(createMaterialDto.materialCode);
        }
        else if(materialWithThisNameInDatabase){
            throw new MaterialAlreadyExistsException(createMaterialDto.materialName);
        }
        const materialTosave:Material={
            ...createMaterialDto
        };
        const savedMaterial=await this.repository.save(materialTosave);
        return savedMaterial;

    }
    public async updateMaterialById(id:string,createMaterialDto:CreateMaterialDto):Promise<Material>{
        const materialWithThisCodeinDatabase=await this.findOneMaterialByMaterialCode(createMaterialDto.materialCode);
        const materialWithThisNameinDatabase=await this.findOneMaterialByMaterialName(createMaterialDto.materialName);
        // do not allow to update if other material with this code or name already exist and throw exception
        if(materialWithThisCodeinDatabase&&materialWithThisCodeinDatabase.id!==Number(id)){
            throw new MaterialAlreadyExistsException(createMaterialDto.materialCode);
        }
        else if(materialWithThisNameinDatabase&&materialWithThisNameinDatabase.id!==Number(id)){
            throw new MaterialAlreadyExistsException(createMaterialDto.materialName);
        }
        const updatedMaterial:Material=await this.repository.update(id,createMaterialDto);
        return updatedMaterial;

    }
    public async deleteMaterialById(id:string):DeleteResult{
       const deleteResult:DeleteResult= await this.repository.delete(id);
       return deleteResult;



    }





}
export default MaterialService;