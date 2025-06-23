
import Product, { ProductDocument } from '@/models/product.model'
import { CreateProductInput, ProductBase, ProductListResponse, ProductSingleResponse, ProductStatus } from "@/graphql/product.graphql";
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
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const product = await Product.findById(newProduct._id).select('-__v').lean<FlattenMaps<ProductDocument>>();

            if(!product) {
                return null
            }

            const mappedProduct: ProductBase = {
                ...product,
                id: product._id.toString()
            }
            
            return {data: mappedProduct}

        } catch (error) {
            logger.error(`Error while creating new product.`, error)
            return null
        }
    }

    async retrieveProducts(limit: number, skip: number): Promise<ProductListResponse | null> {
        try {
            const products = await Product
            .find()
            .limit(limit)
            .skip(skip)
            .select('-__v')
            .lean<FlattenMaps<ProductDocument>[]>();

            const mappedProducts: ProductBase[] = products.map((product): ProductBase => ({
            id: product._id.toString(),
            ...product}));

            return {
                data: mappedProducts
            }
        } catch (error) {
            logger.error(`Error while retrieving products:`, error)
            return null
        }
    }
}