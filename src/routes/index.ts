import { Router } from "express";
import router from './v1/product'

const routes = Router()

routes.use('/product', router)

export default routes