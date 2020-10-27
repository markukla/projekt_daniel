import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getRepository, UpdateResult} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import Product from "../Models/Products/product.entity";
import ProductNotFoundExceptionn from "../Exceptions/ProductNotFoundException";
import CreateProductDto from "../Models/Products/product.dto";
import ProductAlreadyExistsException from "../Exceptions/ProductAlreadyExistsException";
import Order from "../Models/Order/order.entity";


class ProductService implements RepositoryService {

    public repository = getRepository(Product);

    public async findOneProductById(id: string): Promise<Product> {
        const foundProduct: Product = await this.repository.findOne(id); // table name not entity name
        if (!foundProduct) {
            throw new ProductNotFoundExceptionn(id);
        }
        return foundProduct;


    }

    public async findOneProductByProductTypeProductTopTypeProductBottomTypeAndAppropriateCodes(createProductDto: CreateProductDto): Promise<Product> {
        const foundProduct: Product = await this.repository.findOne({

            productTop:createProductDto.productTop,
            productBottom: createProductDto.productBottom,
            productType: createProductDto.productType,



        });

        return foundProduct;


    }


    public async findAllProducts(): Promise<Product[]> {
        const foundProducts: Product[] = await this.repository.find();

        return foundProducts;

    }

    public async addOneProduct(createProductDto: CreateProductDto,orginalDrawingUrl:string): Promise<Product> {
        // do not allow to add the same product twice
        const productInDaTabase: Product = await this.findOneProductByProductTypeProductTopTypeProductBottomTypeAndAppropriateCodes(createProductDto);
        if (productInDaTabase) {
            throw new ProductAlreadyExistsException();
        }
        // i nedd to find the way to obtain urls, for now they are empty string

        const minimalizeDrawingUrl:string='';
        const htmlViewFormUrl:string='';

        const productTosave: Product = {
            ...createProductDto,
            urlOfOrginalDrawing:orginalDrawingUrl,
            urlOfThumbnailDrawing:minimalizeDrawingUrl,


        };
        const savedProduct:Product = await this.repository.save(productTosave);
        return savedProduct;

    }

    public async updateProductById(id: string, createProductDto: CreateProductDto,drawingPath:string): Promise<Product> {
        const idOfExistingProduct: boolean = await this.findOneProductById(id) !== null;
        if (idOfExistingProduct) {

            // do not allow to update if other Product with the same filds already exists
          const productInDatabase:Product= await this.findOneProductByProductTypeProductTopTypeProductBottomTypeAndAppropriateCodes(createProductDto)
            if(productInDatabase&&productInDatabase.id!==Number(id)){
                throw new ProductAlreadyExistsException();
            }
        const productDataToUpdate:Product={
            ...createProductDto,
            urlOfOrginalDrawing:drawingPath,
            urlOfThumbnailDrawing:'',  // nedd to be fixed for now it is empty string


        }
            const updateResult: UpdateResult = await this.repository.update(id, productDataToUpdate);
            if (updateResult.affected === 1) {
                const updatedProduct: Product = await this.findOneProductById(id);
                return updatedProduct;
            }

        }
        else {
            throw new ProductNotFoundExceptionn(id);
        }


    }

    public async deleteProductById(id: string): Promise<DeleteResult> {
        const idOfExistingUser: boolean = await this.findOneProductById(id) !== null;
        if (idOfExistingUser) {
            const deleteResult: DeleteResult = await this.repository.delete(id);
            return deleteResult;
        }
        else {
            throw new ProductNotFoundExceptionn(id);
        }


    }


}

export default ProductService;
