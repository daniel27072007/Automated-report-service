import mongoose from "mongoose"
import { salesModel } from "../models/sales.model.js"

export const salesInput = async (req, res) => {
    const salesData = req.body
    if(!salesData.clientName || !salesData.amount || !salesData.status){
        return res.status(400).json({ error: 'Bad Request', message: 'clientName, amount and status are required.'})
    }
    try {
        const salesRegistered = new salesModel(salesData)
        const salesSaved = await salesRegistered.save()
        res.status(201).json({ message: "sale registered with success", content: salesSaved})
    } catch (error) {
        if(error.name === "ValidationError"){
            return res.status(400).json({ error: 'Bad Request', message: error.message })
        }
        res.status(500).json({ error: error, message: 'something wrong happened when registring the sale'})
    }
}

export const salesRead = async (req, res) => {
    try {
        const oneWeek = new Date()
        oneWeek.setDate(oneWeek.getDate()-7)
        const salesData = await salesModel.find({ createdAt: {$gte: oneWeek} })
        res.status(200).json(salesData)
    } catch (error) {
        res.status(500).json({ error: error, message: 'something wrong happened when reading the sales'})
    }
}
