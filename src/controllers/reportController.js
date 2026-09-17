import { salesModel } from '../models/sales.model.js'
import { reportLogModel } from '../models/reportLog.model.js'
import { sendReportEmail } from '../../functions/Send-Grid-Service.js'
import { CreatePDF_Buffer } from '../../functions/PDF_Generator.js'
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const reportsTrigger = async (req, res) => {
    try {
        const success = await sendReportEmail();
        if (success) {
            return res.status(200).json({ message: 'Report generated and email delivered to SendGrid successfully!' });
        }
        return res.status(500).json({ error: 'Something went wrong when triggering the report email' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
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
    try {
        const reportLogJson = await reportLogModel.find().sort({ executedAt: -1 })
        res.status(200).json(reportLogJson)
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Error generating the report log' });
    }
}