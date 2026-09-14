import { Router } from "express";
import { salesInput, salesRead } from "../controllers/testerController.js";

const testerRouter = Router()

testerRouter.post('/api/tester/send', salesInput)

testerRouter.post('/api/tester/read', salesRead)

export default testerRouter