import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    role: {type: String, required: true, lowercase: true, enum: ['admin', 'employee', 'customer'], default: 'customer'}
},{
    timestamps: true
})

export const userModel = mongoose.model('userModel', userSchema)