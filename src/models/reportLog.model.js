import mongoose, { Schema } from "mongoose";

const reportLogSchema = new mongoose.Schema({
    status: {type: String, required: true, enum: ['SUCCESS', 'FAILED']},
    errorMessage: {type: String}
},{
    timestamps: {createdAt: 'executedAt', updatedAt: false}
})

export const reportLogModel = mongoose.model('reportLogModel', reportLogSchema)