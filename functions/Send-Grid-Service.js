import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendReportEmail = async (pdfBuffer, clientEmail) => {
    const pdfBase64 = pdfBuffer.toString('base64')

    const msg = {
        to: clientEmail,
        from: 'daniel.belculfine@gmail.com',
        subject: 'Weekly Automated Sales Report',
        text: 'Hello! Please find attached your weekly sales report.',
        html: '<strong>Hello!</strong><br>Please find attached your weekly sales report.',
        attachements: [
            {
                content: pdfBase64,
                fileName: 'weekly-report.pdf',
                tpye: 'aplication/pdf',
                disposition: 'attachement',
            }
        ]
    }

    await sgMail.send(msg)
    console.log('email sent')
}