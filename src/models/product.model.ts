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
    status: 'Published' | 'Draft' | 'Out stock';
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