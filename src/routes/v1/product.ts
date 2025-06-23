
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

router.patch('/:id', async(req: Request, res: Response) => {
    const input = req.body
    const {id} = req.params
    const product = await productService.updateProduct(id, input);

    res.status(200).json({
        code: 0,
        status: "OK",
        msg: "Successfully updated!",
        data: product
    })
})

router.delete('/:id', async(req: Request, res: Response) => {
    const {id} = req.params as {id: string}
    const isDeleted = await productService.deleteProduct(id);
    if(!isDeleted) {
        res.status(404).json({
        code: 1,
        status: "NOT_FOUND",
        msg: "Product not found."
    });
    }
    res.status(200).json({
        code: 0,
        status: "NO_CONTENT",
        msg: "Product deleted successfully."
    });
})

export default router;