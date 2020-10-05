import {connectToDatabase} from "../utils/DatabaseUtil/manageDatabaseConnection";
import {config_test} from "../../ormconfig";
import {getManager, getRepository} from "typeorm";
import {insertTestMaterialsToDatabase} from "../utils/DatabaseUtil/insertTestDataToDatabase";
import MaterialService from "../RepositoryServices/materialRepositoryService";

import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import MaTerialsExamples from "./materialsExamplesForTests";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";


beforeAll(async () => {
        await connectToDatabase(config_test);
        await insertTestMaterialsToDatabase();


    }
);
describe('MaterialService', () => {

    describe('when adding an material', () => {
        const maTerialsExamplesforTest = new MaTerialsExamples();
        describe('when material code and name already exist', () => {
            it('should throw material already exist error with invalid material code and name information', async () => {
                const materialService: MaterialService = new MaterialService();
                const invalidMAterialwhichDuplicateAddedMaterial: CreateMaterialDto = maTerialsExamplesforTest.invalidMaterialwhichDuplicateMaterial1DTO;
                await expect(materialService.addOneMaterial(invalidMAterialwhichDuplicateAddedMaterial)).rejects.toMatchObject(new MaterialAlreadyExistsException(invalidMAterialwhichDuplicateAddedMaterial.materialCode, invalidMAterialwhichDuplicateAddedMaterial.materialName));
            });

        });

        describe('when material code  already exist, but name is valid', () => {
            it('should throw material already exist error with invalid material code information', async () => {
                const materialService: MaterialService = new MaterialService();
                const invalidMAterialwhichDuplicateAddedMaterial: CreateMaterialDto = maTerialsExamplesforTest.invalidMaterialwhichDuplicateMaterial1CodeDTO
                await expect(materialService.addOneMaterial(invalidMAterialwhichDuplicateAddedMaterial)).rejects.toMatchObject(new MaterialAlreadyExistsException(invalidMAterialwhichDuplicateAddedMaterial.materialCode, null));
            });


        });

        describe('when material name  already exist, but code is valid', () => {
            it('should throw material already exist error with invalid name information', async () => {
                const materialService: MaterialService = new MaterialService();
                const invalidMAterialwhichDuplicateAddedMaterial: CreateMaterialDto = maTerialsExamplesforTest.invalidMaterialwhichDuplicateMaterial1NameDTO;
                await expect(materialService.addOneMaterial(invalidMAterialwhichDuplicateAddedMaterial)).rejects.toMatchObject(new MaterialAlreadyExistsException(null,invalidMAterialwhichDuplicateAddedMaterial.materialName));
            });


        });
        describe('when material material is ok and does not exist in database', () => {
            it('should be succesfully added to database', async () => {
                const materialService: MaterialService = new MaterialService();
                const validMAterialwhichDuplicateAddedMaterial: CreateMaterialDto = maTerialsExamplesforTest.validMaterialDTO;
                await expect(materialService.addOneMaterial(validMAterialwhichDuplicateAddedMaterial)).resolves.toBeDefined();
            });


        });
    });
    describe('when findAllMaterials', () => {
        it('should be resolved to be defined if materials present in db', async () => {
            const materialService: MaterialService = new MaterialService();

            await expect(materialService.findAllMaterials()).resolves.toBeDefined();
        });

    });

    describe('when findOneMaterial', () => {
        describe('when material with given id does not exist',()=>{
            it('should thrown an error ', async () => {
                const materialService: MaterialService = new MaterialService();
                const unreachableId:string=String(500);

                await expect(materialService.findOneMaterialById(unreachableId)).rejects.toMatchObject(new MaterialNotFoundExceptionn(unreachableId,null,null));
            });
        });
        describe('when material with given id exists',()=>{
            it('should no thrown an error and be resolved ', async () => {
                const materialService: MaterialService = new MaterialService();
                const reachableId:string=String(1);

                await expect(materialService.findOneMaterialById(reachableId)).resolves.toBeDefined();
            });
        });

    });
    describe('when updating an material', () => {
        const maTerialsExamplesforTest = new MaTerialsExamples();
        const idOfNotExistingUser=String(500);
        describe('when material with this id does not exist',()=>{
            it('should throw material does not exist error',async ()=>{
                const materialService=new MaterialService();
                const updatedMaterialData: CreateMaterialDto = maTerialsExamplesforTest.validMaterialForUpdateDTO;
                await expect(materialService.updateMaterialById(idOfNotExistingUser,updatedMaterialData)).rejects.toMatchObject(new MaterialNotFoundExceptionn(idOfNotExistingUser,null,null));

            });

        });

        describe('when material code and name already matched to other material in db', () => {
            it('should throw material already exist error with invalid material code and name information', async () => {
                const materialService: MaterialService = new MaterialService();
                const idOfExistingUser=String(2);

                const invalidMAterialwhichDuplicateAddedMaterial: CreateMaterialDto = maTerialsExamplesforTest.invalidMaterialwhichDuplicateMaterial1DTO;
                await expect(materialService.updateMaterialById(idOfExistingUser,invalidMAterialwhichDuplicateAddedMaterial)).rejects.toMatchObject(new MaterialAlreadyExistsException(invalidMAterialwhichDuplicateAddedMaterial.materialCode, invalidMAterialwhichDuplicateAddedMaterial.materialName));
            });

        });

        describe('when material code   already matched to other material in db, but name is valid', () => {
            it('should throw material already exist error with invalid material code information', async () => {
                const materialService: MaterialService = new MaterialService();
                const idOfExistingUser=String(2);
                const invalidMAterialwhichDuplicateAddedMaterial: CreateMaterialDto = maTerialsExamplesforTest.invalidMaterialwhichDuplicateMaterial1CodeDTO
                await expect(materialService.updateMaterialById(idOfExistingUser,invalidMAterialwhichDuplicateAddedMaterial)).rejects.toMatchObject(new MaterialAlreadyExistsException(invalidMAterialwhichDuplicateAddedMaterial.materialCode, null));
            });


        });

        describe('when material name  already matched to other material in db, but code is valid', () => {
            it('should throw material already exist error with invalid name information', async () => {
                const materialService: MaterialService = new MaterialService();
                const idOfExistingUser=String(2);
                const invalidMAterialwhichDuplicateAddedMaterial: CreateMaterialDto = maTerialsExamplesforTest.invalidMaterialwhichDuplicateMaterial1NameDTO;
                await expect(materialService.updateMaterialById(idOfExistingUser,invalidMAterialwhichDuplicateAddedMaterial)).rejects.toMatchObject(new MaterialAlreadyExistsException(null,invalidMAterialwhichDuplicateAddedMaterial.materialName));
            });


        });

        describe('when material  is ok and does not exist in database', () => {
            it('should be succesfully updated in database', async () => {
                const materialService: MaterialService = new MaterialService();
                const idOfExistingUser=String(1);
                const updatedMaterialData: CreateMaterialDto = maTerialsExamplesforTest.validMaterialForUpdateDTO;
                await expect(materialService.updateMaterialById(idOfExistingUser,updatedMaterialData)).resolves.toBeDefined();
            });


        });
        describe('when material is  partialy updated no error should be thrown that property value already exist', () => {
            it('should be succesfully updated in database', async () => {
                const materialService: MaterialService = new MaterialService();
                const idOfExistingUser=String(1);
                const updatedMaterialData: CreateMaterialDto ={
                    ...maTerialsExamplesforTest.validMaterialForUpdateDTO, // so material code is not updated
                    materialName:'updatedName'
                } ;
                await expect(materialService.updateMaterialById(idOfExistingUser,updatedMaterialData)).resolves.toBeDefined();
            });


        });
    })

    describe('when deleteMaterialById', () => {
        describe('when material with given id does not exist',()=>{
            it('should thrown an error ', async () => {
                const materialService: MaterialService = new MaterialService();
                const unreachableId:string=String(500);

                await expect(materialService.deleteMaterialById(unreachableId)).rejects.toMatchObject(new MaterialNotFoundExceptionn(unreachableId,null,null));
            });
        });
        describe('when material with given id exists',()=>{
            it('should no thrown an error, and delete an record ', async () => {
                const materialService: MaterialService = new MaterialService();
                const reachableId:string=String(3);
                let numberOfDeletedRows:number;
                await materialService.deleteMaterialById(reachableId).then(result=>{
                    numberOfDeletedRows=result.affected;
                });

                await expect(numberOfDeletedRows).toBe(1);
            });
        });

    });


});