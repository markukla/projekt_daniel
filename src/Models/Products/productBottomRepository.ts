import RepositoryService from "../../interfaces/service.interface";


import {DeleteResult, getRepository, UpdateResult} from "typeorm";



import ProductType from "./productType.entity";
import ProductTypeNotFoundException from "../../Exceptions/ProductTypeNotFoundException";
import CreateProductTypeDto from "./createProductType.dto";
import ProductTypeAlreadyExistsException from "../../Exceptions/ProductTypeAlreadyExistException";
import ProductBottom from "./productBottom.entity";
import ProductBottomNotFoundException from "../../Exceptions/ProductBottomNotFoundException";
import CreateProductBottomDto from "./createProductBottom.dto";
import ProductBottomAlreadyExistsException from "../../Exceptions/ProductBottomAlreadyExistsException";


class ProductBottomService implements RepositoryService {

    public repository = getRepository(ProductBottom);

    public async findOneProductBottomById(id: string): Promise<ProductBottom> {
        const foundProductBottom: ProductBottom = await this.repository.findOne(id);
        if (!foundProductBottom) {
            throw new ProductBottomNotFoundException(id);
        }
        return foundProductBottom;


    }

    public async findOneProductBottomByBottomCode(createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        const productBottom: ProductBottom = await this.repository.findOne({
            productBottomCode:createProductBottomDto.productBottomCode
        });

        return productBottom;


    }
    public async findOneProductBottomByBottomType(createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        const productBottom: ProductBottom = await this.repository.findOne({
            productBottomType:createProductBottomDto.productBottomType
        });

        return productBottom;


    }



    public async findAllProductsBottoms(): Promise<ProductBottom[]> {
        const foundProductBottoms: ProductBottom[] = await this.repository.find();

        return foundProductBottoms;

    }

    public async addOneProductType(createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        // do not allow to add the same product twice
        const productBottomWithThisCodeInDatabase: ProductBottom = await this.findOneProductBottomByBottomCode(createProductBottomDto);
        const productBottomWithThisTypeInDatabase: ProductBottom = await this.findOneProductBottomByBottomType(createProductBottomDto);
        let productBottomAlreadyExistInDatabase:boolean=productBottomWithThisCodeInDatabase!==undefined||productBottomWithThisTypeInDatabase!==undefined;

        if (productBottomAlreadyExistInDatabase) {
            throw new ProductBottomAlreadyExistsException();
        }
        const productBottomToSave={
            ...createProductBottomDto
        };


        const savedProductBottom:ProductBottom = await this.repository.save(productBottomToSave);
        return savedProductBottom;

    }

    public async updateProductBottomById(id: string, createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        const idOfExistingProductBottom: boolean = await this.findOneProductBottomById(id) !== null;
        if (idOfExistingProductBottom) {

            // do not allow to update if other ProductType with the same filds already exists
            const productBottomWithThisCodeInDatabase: ProductBottom = await this.findOneProductBottomByBottomCode(createProductBottomDto);
            const productBottomWithThisTypeInDatabase: ProductBottom = await this.findOneProductBottomByBottomType(createProductBottomDto);
            if (productBottomWithThisTypeInDatabase) {
                if (productBottomWithThisTypeInDatabase.id !== Number(id)) {
                    throw new ProductBottomAlreadyExistsException();

                }
            }
            if (productBottomWithThisCodeInDatabase) {
                if (productBottomWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductBottomAlreadyExistsException();

                }
            }

            const productTypeToUpdate: ProductBottom = {
                ...createProductBottomDto

            }
            const updateResult: UpdateResult = await this.repository.update(id, productTypeToUpdate);
            if (updateResult.affected === 1) {
                const updatedProductBottom: ProductBottom = await this.findOneProductBottomById(id);
                return updatedProductBottom;
            }


        }
    }

    public async deleteProductBottomById(id: string): Promise<DeleteResult> {
        const idOfExistingProductBottom: boolean = await this.findOneProductBottomById(id) !==undefined;
        if (idOfExistingProductBottom) {
            const deleteResult: DeleteResult = await this.repository.delete(id);
            return deleteResult;
        }
        else {
            throw new ProductBottomNotFoundException(id);
        }


    }


}

export default ProductBottomService;
