import { Router } from "express";
import { reportsTrigger, reportsPreview, reportsStatus } from "../controllers/reportController.js";

const reportRouter = Router()

reportRouter.post('/api/reports/trigger', reportsTrigger)

reportRouter.get('/api/reports/preview', reportsPreview)

reportRouter.get('/api/reports/status', reportsStatus)

export default reportRouter