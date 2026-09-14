import express from 'express'
import authRouter from './routes/report.routes.js'
import protectedRouter from './routes/protected.routes.js'

const app = express()

app.use(express.json())

app.use(authRouter)

app.use(protectedRouter)

app.use((error, req, res, next)=>{
    console.error('Unexpected server error', error.stack)
    return res.status(500).json({ 
        error: "Internal Server Error", 
        message: "An unexpected error occurred on the server." 
    });
})

export default app