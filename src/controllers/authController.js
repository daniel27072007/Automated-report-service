import { userModel } from '../models/user.model.js'
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
        return res.status(201).json({ message: 'User registered with success!'})
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
        return res.status(201).json({ message: 'User logged with success!'})
    } catch (error) {
        if(error.name === "ValidationError"){
            return res.status(400).json({ error: 'Bad Request', message: error.message})
        }
        res.status(500).json({ error: 'Something went wrong with the server when login the user.', error})
    }
}