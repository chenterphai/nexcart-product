import { ProductBase, ProductListResponse, ProductSingleResponse, ProductSortInput } from "@/graphql/product.graphql";
import { ProductService } from "@/services/product.service";
import { Arg, Int, Query, Resolver } from "type-graphql";


@Resolver(() => ProductBase)
export class ProductResolver {
    private productService: ProductService;

    constructor() {
         this.productService = new ProductService();
    }

    @Query(() => ProductListResponse, {nullable: true})
    async retrieveProduct(
        @Arg('limit', () => Int, { nullable: true }) limit: number,
        @Arg('offset', () => Int, { nullable: true }) offset: number,
        @Arg('sort', () => ProductSortInput, {nullable: true}) sort: ProductSortInput
    ): Promise<ProductListResponse | null>  {
        return await this.productService.retrieveProducts(limit, offset, sort)
    }

    @Query(() => ProductSingleResponse, {nullable: true})
    async retrieveSingleProduct(
        @Arg('id') id: string
    ): Promise<ProductSingleResponse | null> {
        return await this.productService.retrieveSingleProduct(id)
    }
}