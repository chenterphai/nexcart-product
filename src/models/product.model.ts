import { ProductStatus } from '@/graphql/product.graphql';
import { Document, Double, Schema, Types, model } from 'mongoose';


export interface IProduct {
    sku: string;
    name: string;
    description: string;
    price: Double;
    discount?: Double;
    images: string[];
    categories: string[];
    stock: number;
    variants?: ProductVariant[];
    status: 'Published' | 'Draft' | 'Out stock';
}

export interface ProductVariant {
    name?: string;
    color?: string;
    size?: string;
    price?: Double;
    image?: string;
}

export interface ProductDocument extends Document {
    _id: Types.ObjectId;
    sku: string;
    name: string;
    description?: string;
    price: number;
    discount?: number;
    images: string[];
    categories: string[];
    variants?: {
        name?: string;
        price?: number;
        size?: string;
        color?: string;
        image?: string;
    }[];
    status: ProductStatus;
    createdAt: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>({
    sku: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    price: {
        type: Schema.Types.Double,
        required: true
    },
    discount: {
        type: Schema.Types.Double,
    },
    images: {
        type: [String],
        required: true
    },
    categories: {
        type: [String]
    },
    variants: [
        {
            name: { type: String },
            price: {  type: Schema.Types.Double, },
            size: { type: String },
            color: { type: String },
            image: { type: String },
        }
    ],
    status: {
        type: String,
        required: true,
        enum: {
            values: ['Published', 'Draft', 'Out stock'],
            message: 'Invalid Status!'
        },
        default: 'Published'
    }
}, {
    timestamps: true
});

export default model<IProduct>('Product', productSchema);