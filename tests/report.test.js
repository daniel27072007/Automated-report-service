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

    it('should respond with 200 and return a PDF buffer on preview route', async () => {
        await salesModel.create({
            clientName: "PREVIEW CORP",
            amount: 50.00,
            status: "paid"
        });

        const response = await supertest(app)
            .get('/api/reports/preview')
            .send();

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');
        expect(response.headers['content-disposition']).toContain('inline; filename=weekly-report.pdf');
    });

    it('should respond with 200 and return the list of logs on status route', async () => {
        await reportLogModel.create({ status: 'SUCCESS' });
        await reportLogModel.create({ status: 'FAILED', errorMessage: 'API Error' });

        const response = await supertest(app)
            .get('/api/reports/status')
            .send();

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        
        expect(response.body[0].status).toBeTruthy(); 
    });
})