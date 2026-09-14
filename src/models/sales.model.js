import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    clientName: {type: String, required: true},
    amount: {type: Number, required: true},
    status: {type: String, required: true, enum: ['paid', 'pending']},
},{
    timestamps: {createdAt: true, updatedAt: false}
})

export const salesModel = mongoose.model('salesModel', salesSchema)