import fs from 'fs'
import PDFDocument from 'pdfkit'

function createPdf(){
    const doc = new PDFDocument
    doc.pipe(fs.createWriteStream('meu-primeiro-pdf'))
    doc.fontSize(25).text('Relatório Semanal de Vendas', 100, 100)
    doc.end()
    console.log("pdf created with success");
}

createPdf()