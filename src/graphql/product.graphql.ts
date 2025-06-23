import { Field, Float, InputType, ObjectType, registerEnumType } from "type-graphql";


export enum ProductStatus {
    Published = 'Published',
    Draft = 'Draft',
    OutStock = 'Out stock'
}

registerEnumType(ProductStatus, {
    name: 'ProductStatus'
})


export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'Ascending or Descending sort order.',
});

export enum ProductSortField {
  CreatedAt = 'createdAt', 
  Name = 'name',
  Price = 'price',
  Categories = 'categories',
  Status = 'status',
  Sku = 'sku'
}
registerEnumType(ProductSortField, {
  name: 'ProductSortField',
  description: 'Fields by which Products can be sorted.',
});

@ObjectType()
export class ProductBase {
    @Field(() => String)
    id!: string

    @Field(() => String)
    sku!: string;

    @Field(() => String)
    name!: string;

    @Field(() => String, {nullable: true})
    description?: string;

    @Field(() => Float)
    price!: number;

    @Field(()=> Float, {nullable: true})
    discount?: number;

    @Field(() => [String])
    images!: string[]
    
    @Field(() => [String])
    categories!: string[]
    
    @Field(() => ProductStatus, {defaultValue: ProductStatus.Published})
    status!: ProductStatus;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date, {nullable: true})
    updatedAt?: Date;    
}


@InputType()
export class CreateProductInput {
    @Field(() => String)
    sku?: string;

    @Field(() => String)
    name!: string;

    @Field(() => String, {nullable: true})
    description?: string;

    @Field(() => Float)
    price!: number;

    @Field(()=> Float)
    discount?: number;

    @Field(() => [String])
    images!: string[]
    
    @Field(() => [String])
    categories!: string[]
    
    @Field(() => ProductStatus, {defaultValue: ProductStatus.Published})
    status!: ProductStatus;
}

@InputType()
export class UpdateProductInput {
    @Field(() => String, {nullable: true})
    sku?: string;

    @Field(() => String, {nullable: true})
    name?: string;

    @Field(() => String, {nullable: true})
    description?: string;

    @Field(() => Float, {nullable: true})
    price?: number;

    @Field(()=> Float, {nullable: true})
    discount?: number;

    @Field(() => [String], {nullable: true})
    images?: string[]
    
    @Field(() => [String], {nullable: true})
    categories?: string[]
    
    @Field(() => ProductStatus, {defaultValue: ProductStatus.Published, nullable: true})
    status?: ProductStatus;

    @Field(() => Date, {nullable: true})
    updatedAt?: Date;    
}


@InputType()
export class ProductSortInput {
    @Field(() => ProductSortField, {defaultValue: ProductSortField.CreatedAt})
    field!: ProductSortField;

    @Field(() => SortDirection, {defaultValue: SortDirection.DESC})
    direction?: SortDirection;
}


@ObjectType()
export class ProductListResponse {
    @Field(() => [ProductBase], {nullable: true})
    data?: ProductBase[] | null | []
}

@ObjectType()
export class ProductSingleResponse {
    @Field(() => ProductBase, {nullable: true})
    data?: ProductBase | null
}