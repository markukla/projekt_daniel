import RepositoryService from "../../interfaces/service.interface";


import {DeleteResult, getRepository, UpdateResult} from "typeorm";




import ProductBottom from "./productBottom.entity";
import ProductBottomNotFoundException from "../../Exceptions/ProductBottomNotFoundException";
import CreateProductBottomDto from "./createProductBottom.dto";
import ProductBottomAlreadyExistsException from "../../Exceptions/ProductBottomAlreadyExistsException";
import ProductTop from "./productTop.entity";
import ProductTopNotFoundException from "../../Exceptions/ProductTopNotFoundException";
import CreateProductTopDto from "./createProductTop.dto";
import ProductTopAlreadyExistsException from "../../Exceptions/ProductTopAlreadyExistsException";


class ProductTopService implements RepositoryService {

    public repository = getRepository(ProductTop);

    public async findOneProductTopById(id: string): Promise<ProductTop> {
        const foundProductTop: ProductTop = await this.repository.findOne(id);
        if (!foundProductTop) {
            throw new ProductTopNotFoundException(id);
        }
        return foundProductTop;


    }

    public async findOneProductTopByTopCode(createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        const productTop: ProductTop = await this.repository.findOne({
            productTopCode:createProductTopDto.productTopCode
        });

        return productTop;


    }
    public async findOneProductTopByTopType(createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        const productTop: ProductTop = await this.repository.findOne({
            productTopType:createProductTopDto.productTopType
        });

        return productTop;


    }



    public async findAllProductsTops(): Promise<ProductTop[]> {
        const foundProductTops: ProductTop[] = await this.repository.find();

        return foundProductTops;

    }

    public async addOneProductTope(createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        // do not allow to add the same product twice
        const productTopWithThisCodeInDatabase: ProductTop = await this.findOneProductTopByTopCode(createProductTopDto);
        const productTopWithThisTypeInDatabase: ProductTop = await this.findOneProductTopByTopType(createProductTopDto);
        let productTopAlreadyExistInDatabase:boolean=productTopWithThisCodeInDatabase!==undefined||productTopWithThisTypeInDatabase!==undefined;

        if (productTopAlreadyExistInDatabase) {
            throw new ProductTopAlreadyExistsException();
        }
        const productTopToSave={
            ...createProductTopDto
        };


        const savedProductTop:ProductTop = await this.repository.save(productTopToSave);
        return savedProductTop;

    }

    public async updateProductTopById(id: string, createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        const idOfExistingProductTOp: boolean = await this.findOneProductTopById(id) !== null;
        if (idOfExistingProductTOp) {

            // do not allow to update if other ProductType with the same filds already exists
            const productTopWithThisCodeInDatabase: ProductTop = await this.findOneProductTopByTopCode(createProductTopDto);
            const productTopWithThisTypeInDatabase: ProductTop = await this.findOneProductTopByTopType(createProductTopDto);
            if (productTopWithThisTypeInDatabase) {
                if (productTopWithThisTypeInDatabase.id !== Number(id)) {
                    throw new ProductTopAlreadyExistsException();

                }
            }
            if (productTopWithThisCodeInDatabase) {
                if (productTopWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductTopAlreadyExistsException();

                }
            }

            const productTopeToUpdate: ProductTop = {
                ...createProductTopDto

            }
            const updateResult: UpdateResult = await this.repository.update(id, productTopeToUpdate);
            if (updateResult.affected === 1) {
                const updatedProductTop: ProductTop = await this.findOneProductTopById(id);
                return updatedProductTop;
            }


        }
    }

    public async deleteProductTopById(id: string): Promise<DeleteResult> {
        const idOfExistingProductTop: boolean = await this.findOneProductTopById(id) !==undefined;
        if (idOfExistingProductTop) {
            const deleteResult: DeleteResult = await this.repository.delete(id);
            return deleteResult;
        }
        else {
            throw new ProductTopNotFoundException(id);
        }


    }


}

export default ProductTopService;
