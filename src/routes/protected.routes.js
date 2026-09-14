import { Router } from "express";
import { customerRoute, employeeRoute, adminRoute } from "../controllers/protectedController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const protectedRouter = Router()

protectedRouter.post('/customer', authMiddleware(['customer', 'employee', 'admin']), customerRoute)

protectedRouter.post('/employee', authMiddleware(['employee', 'admin']), employeeRoute)

protectedRouter.post('/admin', authMiddleware(['admin']), adminRoute)

export default protectedRouter