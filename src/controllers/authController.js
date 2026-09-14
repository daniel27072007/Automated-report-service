import { userModel } from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'

export const registerUser = async (req, res) => {
    try {
        const registerData = req.body
        if(!registerData.name || !registerData.email || !registerData.password){
            return res.status(400).json({ error: 'Bad Request', message: 'name, email and password are required.'})
        }
        if(registerData.role !== 'admin' && registerData.role !== 'employee' && registerData.role !== 'customer'){
            return res.status(400).json({ error: 'Bad Request', message: 'you can only input admin, employee or customer'})
        }
        const userData = {
            name: registerData.name,
            email: registerData.email,
            role: registerData.role,
            password: registerData.password
        }
        const registeredUser = new userModel(userData)
        const savedUser = await registeredUser.save()
        const tokenAccess = jwt.sign(
            {userId: savedUser._id, userRole: savedUser.role},
            process.env.TOKEN_ACCESS_KEY,
            {expiresIn: process.env.TOKEN_ACCESS_EXPIRES}
        )
        return res.status(201).json({ message: 'User registered with success!', 'access-token': tokenAccess})
    } catch (error) {
        if(error.code === 11000){
            if(error.message.includes('name')){
                return res.status(400).json({ error: 'Bad Request', message: 'This name was already registered' })
            }
            if(error.message.includes('email')){
                return res.status(400).json({ error: 'Bad Request', message: 'This email was already registered' })
            }
        }
        res.status(500).json({ error: error, message: 'something wrong happend when registring the user'})
    }
}

export const loginUser = async (req, res) => {
    try {
        const loginData = req.body
        if(!loginData.email || !loginData.password){
            return res.status(400).json({ error: 'Bad Request', message: 'email and password are required.'})
        }
        const loggedUser = await userModel.findOne({ email: loginData.email })
        if(!loggedUser){
            return res.status(400).json({ error: 'email or password are invalid.'})
        }
        const isPasswordValid = await bcrypt.compare(loginData.password, loggedUser.password)
        if(!isPasswordValid){
            return res.status(401).json({ error: 'Invalid Email or Password.' });         
        }
        const tokenAccess = jwt.sign(
            {userId: loggedUser._id, userRole: loggedUser.role},
            process.env.TOKEN_ACCESS_KEY,
            {expiresIn: process.env.TOKEN_ACCESS_EXPIRES}
        )
        return res.status(201).json({ message: 'User logged with success!', 'access-token': tokenAccess})
    } catch (error) {
        if(error.name === "ValidationError"){
            return res.status(400).json({ error: 'Bad Request', message: error.message})
        }
        res.status(500).json({ error: 'Something went wrong with the server when login the user.', error})
    }
}