
import Product, { ProductDocument } from '@/models/product.model'
import { CreateProductInput, ProductBase, ProductListResponse, ProductSingleResponse, ProductSortInput, ProductStatus, ProductVariant, SortDirection, UpdateProductInput } from "@/graphql/product.graphql";
import { logger } from "@/libs/winston";
import generateProductSku from '@/utils/productIdGenerator';
import { FlattenMaps } from 'mongoose';

export class ProductService {

    async createProduct(input: CreateProductInput): Promise<ProductSingleResponse | null> {
        try {

            const sku = generateProductSku()
            
            const newProduct = await Product.create({
                ...input,
                sku,
                varients: input.variants?.map((variant): ProductVariant => ({
                    name: variant.name,
                    price: variant.price,
                    size: variant.size,
                    color: variant.color,
                    image: variant.image,
                })), 
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const product = await Product.findById(newProduct._id).select('-__v').lean<FlattenMaps<ProductDocument>>();

            if(!product) {
                return null
            }

            const mappedProduct: ProductBase = {
                ...product,
                id: product._id.toString(),
                variants: product.variants?.map((variant) => ({
                    ...variant,
                    price: Number(variant.price) 
                }))
            }
            
            return {data: mappedProduct}

        } catch (error) {
            logger.error(`Error while creating new product.`, error)
            return null
        }
    }

    async retrieveProducts(limit: number, skip: number, sort: ProductSortInput): Promise<ProductListResponse | null> {
        const {direction, field} = sort
        const sortObject: { [key: string]: 1 | -1 } = {};
        sortObject[field] = direction === SortDirection.ASC ? 1 : -1;
        try {
            const products = await Product
            .find()
            .limit(limit)
            .skip(skip)
            .sort(sortObject)
            .select('-__v')
            .lean<FlattenMaps<ProductDocument>[]>();

            const mappedProducts: ProductBase[] = products.map((product): ProductBase => ({
                ...product,
                id: product._id.toString(),
                variants: product.variants?.map((variant): ProductVariant => ({
                    ...variant,
                    price: Number(variant.price)
                }))
            }));

            return {
                data: mappedProducts
            }
        } catch (error) {
            logger.error(`Error while retrieving products:`, error)
            return null
        }
    }

    async retrieveSingleProduct(id: string): Promise<ProductSingleResponse | null> {
        try {
            
            const product =  await Product.findById(id).select('-__v').lean<FlattenMaps<ProductDocument>>();

            if(!product) {
                return null
            }

            const mappedProduct: ProductBase = {
                ...product,
                id: product._id.toString(),
                variants: product.variants?.map((variant): ProductVariant => ({
                    ...variant,
                    price: Number(variant.price) 
                })) || null
            }
            
            return {data: mappedProduct}

        } catch (error) {
            return null
        }
    }

    async updateProduct(
        id: string,
        input: UpdateProductInput
    ): Promise<ProductSingleResponse | null> {
        try {
            if(!id) {
                return null
            }
            await Product.findByIdAndUpdate(id, {
                ...input
            });


            const product =  await Product.findById(id).select('-__v').lean<FlattenMaps<ProductDocument>>();

            if(!product) {
                return null
            }

            const mappedProduct: ProductBase = {
                ...product,
                id: product._id.toString(),
                variants: product.variants?.map((variant): ProductVariant => ({
                    ...variant,
                    price: Number(variant.price) 
                }))
            }
            
            return {data: mappedProduct}
        } catch (error) {
            logger.error(`Error while updating a product.`, error);
            return null;
        }
    }

    async deleteProduct(
        id: string
    ): Promise<Boolean> {
        try {
            if(!id) {
                logger.warn(`No product ID provied.`);
                return false;
            }

            if(!await Product.findByIdAndDelete(id)) {
                return false;
            }
            return true
        } catch (error) {
            logger.error(`Error while deleting a product: ${id}`)
            return false
        }
    }
}