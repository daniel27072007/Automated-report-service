import 'dotenv/config'
import supertest from "supertest";
import mongoose from "mongoose";
import app from '../src/app.js'
import connectDatabase from '../src/config/database.js'
import { salesModel } from "../src/models/sales.model.js";
import { reportLogModel } from "../src/models/reportLog.model.js";

describe('Intergration tests - report routes', () => {

    beforeAll(async ()=>{
        await connectDatabase()
    })

    beforeEach(async ()=>{
        await salesModel.deleteMany({})
        await reportLogModel.deleteMany({})
    })

    afterAll(async ()=>{
        await mongoose.connection.close()
    })

    it('should respond with 200 when sending the report manualy', async () => {
        await salesModel.create({
            clientName: "ACNE CORP",
            amount: 100.00,
            status: "paid"
        })

        const response = await supertest(app)
            .post('/api/reports/trigger')
            .send()

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Report generated and email delivered to SendGrid successfully!')

        const createdLog = await reportLogModel.findOne()
        expect(createdLog).toBeTruthy()
        expect(createdLog.status).toBe('SUCCESS')
    })
})