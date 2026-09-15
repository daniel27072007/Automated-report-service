import { salesModel } from '../models/sales.model.js'
import { CreatePDF_Buffer } from '../../functions/PDF_Generator.js'
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const reportsTrigger = async (req, res) => {
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
        res.status(200).json({ 
            message: 'Report generated and email delivered to SendGrid successfully!' 
        });
    } catch (error) {
        console.error('Erro no SendGrid:', error);
        res.status(500).json({ 
            error: error.message, 
            message: 'Something went wrong when triggering the report email' 
        });
    }
}

export const reportsPreview = async (req, res) => {
    try {
        const oneWeek = new Date()
        oneWeek.setDate(oneWeek.getDate()-7)
        const salesData = await salesModel.find({ createdAt: {$gte: oneWeek} })
        const pdfBuffer = await CreatePDF_Buffer(salesData)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=weekly-report.pdf');
        res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, message: 'Error generating PDF preview' });
    }
}

export const reportsStatus = async (req, res) => {
    
}