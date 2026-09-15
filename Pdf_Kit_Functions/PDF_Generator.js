import fs from 'fs'
import PDFDocument from 'pdfkit'

// const vendasDoBanco = [
//     { clientName: 'Ana Silva', amount: 150.00, status: 'pago' },
//     { clientName: 'Bruno Costa', amount: 89.90, status: 'pago' },
//     { clientName: 'Carlos Souza', amount: 450.00, status: 'pendente' },
//     { clientName: 'Daniela Lima', amount: 230.15, status: 'pago' }
//   ];

export function createPDF (dataTable) {
    const doc = new PDFDocument
    doc.pipe(fs.createWriteStream('Weekly-Automated-Sales-Report.pdf'))

    doc.fontSize(22).fillColor('#333333').text('Weekly Automated Sales Report', 50, 50)
    doc.moveTo(50, 85).lineTo(550, 85).stroke('black')

    let yActual = 110;
    doc.fontSize(12).fillColor('black');
    doc.text('clients', 50, yActual, { bold: true });
    doc.text('amounts', 300, yActual);
    doc.text('statuses', 450, yActual);
    doc.moveTo(50, 125).lineTo(550, 125).strokeColor('#aaaaaa').stroke();

    yActual = 140
    let totalAmount = 0
    dataTable.forEach((element) => {
        doc.fontSize(11).fillColor('#555555');
        doc.text(element.clientName, 50, yActual);
        doc.text(`$ ${element.amount.toFixed(2)}`, 300, yActual);
        doc.text(element.status.toUpperCase(), 450, yActual);
        yActual += 25;
        totalAmount += element.amount
    });

    doc.moveTo(50, yActual).lineTo(550, yActual).strokeColor('#aaaaaa').stroke();
    yActual += 25
    doc.text('TOTAL:', 50, yActual, { bold: true });
    doc.text(`$ ${totalAmount.toFixed(2)}`, 300, yActual);

    doc.end()
}

//createPDF(vendasDoBanco)