import { Router } from "express";
import { customerRoute, employeeRoute, adminRoute } from "../controllers/protectedController.js";

const protectedRouter = Router()

protectedRouter.post('/customer', customerRoute)

protectedRouter.post('/employee', employeeRoute)

protectedRouter.post('/admin', adminRoute)

export default protectedRouter