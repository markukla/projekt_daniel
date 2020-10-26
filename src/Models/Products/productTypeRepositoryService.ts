import RepositoryService from "../../interfaces/service.interface";


import {DeleteResult, getRepository, UpdateResult} from "typeorm";




import ProductAlreadyExistsException from "../Exceptions/ProductAlreadyExistsException";

import ProductType from "./productType.entity";
import ProductTypeNotFoundException from "../../Exceptions/ProductTypeNotFoundException";
import CreateProductTypeDto from "./createProductType.dto";
import ProductTypeAlreadyExistsException from "../../Exceptions/ProductTypeAlreadyExistException";


class ProductTypeService implements RepositoryService {

    public repository = getRepository(ProductType);

    public async findOneProductTypeById(id: string): Promise<ProductType> {
        const foundProductType: ProductType = await this.repository.findOne(id); // table name not entity name
        if (!foundProductType) {
            throw new ProductTypeNotFoundException(id);
        }
        return foundProductType;


    }

    public async findOneProductTypeByProductTypeCode(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        const foundProduct: ProductType = await this.repository.findOne({
            productTypeCode:createProductTypeDto.productTypeCode
        });

        return foundProduct;


    }
    public async findOneProductTypeByProductTypeName(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        const foundProduct: ProductType = await this.repository.findOne({
            productTypeName:createProductTypeDto.productTypeName
        });

        return foundProduct;


    }


    public async findAllProductsTypes(): Promise<ProductType[]> {
        const foundProductTypes: ProductType[] = await this.repository.find();

        return foundProductTypes;

    }

    public async addOneProductType(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        // do not allow to add the same product twice
        const productTypeWithThisCodeInDatabase: ProductType = await this.findOneProductTypeByProductTypeCode(createProductTypeDto);
        const productTypeWithThisNameInDatabase: ProductType = await this.findOneProductTypeByProductTypeName(createProductTypeDto);
        let productTypeAlreadyExistInDatabase:boolean=productTypeWithThisCodeInDatabase!==null||productTypeWithThisNameInDatabase!==null;

        if (productTypeAlreadyExistInDatabase) {
            throw new ProductTypeAlreadyExistsException();
        }
        const productTypeToSave={
            ...createProductTypeDto
        };


        const savedProductType:ProductType = await this.repository.save(productTypeToSave);
        return savedProductType;

    }

    public async updateProductTypeById(id: string, createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        const idOfExistingProductType: boolean = await this.findOneProductTypeById(id) !== null;
        if (idOfExistingProductType) {

            // do not allow to update if other ProductType with the same filds already exists
            const productTypeWithThisCodeInDatabase: ProductType = await this.findOneProductTypeByProductTypeCode(createProductTypeDto);
            const productTypeWithThisNameInDatabase: ProductType = await this.findOneProductTypeByProductTypeName(createProductTypeDto);

            if (productTypeWithThisNameInDatabase) {
                if (productTypeWithThisNameInDatabase.id !== Number(id)) {
                    throw new ProductTypeAlreadyExistsException();

                }
            }
            if (productTypeWithThisCodeInDatabase) {
                if (productTypeWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductTypeAlreadyExistsException();

                }
            }

            const productTypeToUpdate: ProductType = {
                ...createProductTypeDto

            }
            const updateResult: UpdateResult = await this.repository.update(id, productTypeToUpdate);
            if (updateResult.affected === 1) {
                const updatedProductType: ProductType = await this.findOneProductTypeById(id);
                return updatedProductType;
            }


        }
    }

    public async deleteProductTypeById(id: string): Promise<DeleteResult> {
        const idOfExistingProductType: boolean = await this.findOneProductTypeById(id) !== null;
        if (idOfExistingProductType) {
            const deleteResult: DeleteResult = await this.repository.delete(id);
            return deleteResult;
        }
        else {
            throw new ProductTypeNotFoundException(id);
        }


    }


}

export default ProductTypeService;
