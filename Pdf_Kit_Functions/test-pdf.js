import fs from 'fs'
import PDFDocument from 'pdfkit'

function createPdf(){
    const doc = new PDFDocument
    doc.pipe(fs.createWriteStream('meu-primeiro-pdf'))
    doc.fontSize(25).text('Relatório Semanal de Vendas', 100, 100)
    doc.end()
    console.log("pdf created with success");
}

function testarEstilos() {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('teste-estilos.pdf'));

  // 1. Título Grande e Azul
  // .fillColor() muda a cor do texto (aceita nomes em inglês ou códigos Hexadecimais como #FF0000)
  doc.fontSize(28)
     .fillColor('blue')
     .text('Painel de Controle', 50, 50); // X = 50 (perto da borda esquerda), Y = 50 (perto do topo)

  // 2. Um subtítulo menor e cinza, posicionado logo abaixo (Y = 90)
  doc.fontSize(14)
     .fillColor('#666666')
     .text('Relatório gerado automaticamente pelo sistema.', 50, 90);

  // 3. Uma linha horizontal divisória para separar o cabeçalho
  // .moveTo(X, Y) define onde a linha começa / .lineTo(X, Y) define onde ela termina
  doc.moveTo(50, 120)
     .lineTo(550, 120)
     .strokeColor('#cccccc') // Cor da linha
     .stroke(); // Desenha a linha de fato

  // 4. Um texto corrido padrão, posicionado abaixo da linha (Y = 140)
  doc.fontSize(12)
     .fillColor('black')
     .text('Aqui começará a nossa lista de vendas que buscamos do MongoDB.', 50, 140);

  doc.end();
  console.log('PDF de estilos criado com sucesso!');
}

function gerarListaVendas() {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('relatorio-dinamico.pdf'));

  // Cabeçalho fixo
  doc.fontSize(22).fillColor('#333333').text('Relatório Semanal de Vendas', 50, 50);
  
  // Linha divisória
  doc.moveTo(50, 85).lineTo(550, 85).strokeColor('#dddddd').stroke();

  // Cabeçalhos da nossa "tabela" (X diferentes, mas mesma altura Y)
  let yAtual = 110;
  doc.fontSize(12).fillColor('black');
  doc.text('Cliente', 50, yAtual, { bold: true });
  doc.text('Valor', 300, yAtual);
  doc.text('Status', 450, yAtual);

  // Linha abaixo do cabeçalho da tabela
  doc.moveTo(50, 125).lineTo(550, 125).strokeColor('#aaaaaa').stroke();

  // === SIMULAÇÃO DOS DADOS DO MONGODB ===
  const vendasDoBanco = [
    { clientName: 'Ana Silva', amount: 150.00, status: 'pago' },
    { clientName: 'Bruno Costa', amount: 89.90, status: 'pago' },
    { clientName: 'Carlos Souza', amount: 450.00, status: 'pendente' },
    { clientName: 'Daniela Lima', amount: 230.15, status: 'pago' }
  ];

  // Definimos onde a primeira linha de dados vai começar
  yAtual = 140; 

  // Passamos por cada venda do array
  vendasDoBanco.forEach((venda) => {
    doc.fontSize(11).fillColor('#555555');
    
    // Desenhamos os dados da venda atual na altura de yAtual
    doc.text(venda.clientName, 50, yAtual);
    doc.text(`R$ ${venda.amount.toFixed(2)}`, 300, yAtual);
    doc.text(venda.status.toUpperCase(), 450, yAtual);

    // IMPORTANTE: Somamos 25 pontos na altura para a próxima venda ir para baixo!
    yAtual += 25; 
  });

  doc.end();
  console.log('PDF dinâmico criado com sucesso!');
}

gerarListaVendas();