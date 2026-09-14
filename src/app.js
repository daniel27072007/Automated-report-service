import express from 'express'
import reportRouter from './routes/report.routes.js'
import testerRouter from './routes/tester.routes.js'

const app = express()

app.use(express.json())

app.use(reportRouter)

app.use(testerRouter)

app.use((error, req, res, next)=>{
    console.error('Unexpected server error', error.stack)
    return res.status(500).json({ 
        error: "Internal Server Error", 
        message: "An unexpected error occurred on the server." 
    });
})

export default app