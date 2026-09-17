import { salesModel } from '../src/models/sales.model.js'
import { reportLogModel } from '../src/models/reportLog.model.js'
import { CreatePDF_Buffer } from './PDF_Generator.js'
import sgMail from '@sendgrid/mail'
import 'dotenv/config'

export const sendReportEmail = async () => {
    try {
        if(process.env.NODE_ENV !== 'test'){
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        }
        else{
            sgMail.setApiKey(process.env.SENDGRID_API_KEY_TEST)
        }
        const oneWeek = new Date()
        oneWeek.setDate(oneWeek.getDate()-7)
        const salesData = await salesModel.find({ createdAt: {$gte: oneWeek} })
        const pdfBuffer = await CreatePDF_Buffer(salesData)
        const pdfBase64 = pdfBuffer.toString('base64')
        const msg = {
            to: 'daniel.belculfine@gmail.com',
            from: 'daniel.belculfine@gmail.com',
            subject: 'Weekly Automated Sales Report',
            text: 'Hello! Please find attached your weekly sales report.',
            html: '<strong>Hello!</strong><br>Please find attached your weekly sales report.',
            attachments: [
                {
                    content: pdfBase64,
                    filename: 'weekly-report.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment',
                }
            ]
        }
        await sgMail.send(msg)
        await reportLogModel.create({ status: 'SUCCESS' })
        return true
    } catch (error) {
        console.error('Erro no SendGrid:', error);
        await reportLogModel.create({ status: 'FAILED', errorMessage: error.message })
        return false
    }
}