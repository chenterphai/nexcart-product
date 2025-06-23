
import { CreateProductInput } from "@/graphql/product.graphql";
import { ProductService } from "@/services/product.service";
import { Router } from "express";
import type { Request, Response } from 'express';

const router = Router()

const productService = new ProductService();


router.post('/', async(req: Request, res: Response) => {

    const input = req.body

    const product = await productService.createProduct(input);

    res.status(201).json({
        code: 0,
        status: "CREATED",
        msg: "Successfully created.",
        data: product
    });
    
});

export default router;