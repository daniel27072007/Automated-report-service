import { sendReportEmail } from '../functions/Send-Grid-Service.js'
import cron from 'node-cron'

cron.schedule('0 0 * * 0', async () => {
    await sendReportEmail()
    console.log('report automatic sended')
})
