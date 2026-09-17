import { salesModel } from './models/sales.model.js'
import { CreatePDF_Buffer } from '../functions/PDF_Generator.js'
import 'dotenv/config'
import sgMail from '@sendgrid/mail'
import cron from 'node-cron'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const runWeeklyReport = async () => {
    try {
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
                    type: 'aplication/pdf',
                    disposition: 'attachment',
                }
            ]
        }
        await sgMail.send(msg)
    } catch (error) {
        console.error('Erro no SendGrid:', error);
    }
}

cron.schedule('0 0 * * 0', () => {
    runWeeklyReport()
    console.log('report automatic sended')
})
