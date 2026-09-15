import { salesModel } from '../models/sales.model.js'
import { CreatePDF_Buffer } from '../../Pdf_Kit_Functions/PDF_Generator.js'
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'

export const reportsTrigger = async (req, res) => {
    
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