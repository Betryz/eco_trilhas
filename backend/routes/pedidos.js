var express = require('express');
const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ errorFormat: "minimal" });
const { exceptionHandler } = require('../utils/ajuda');
const { generateAccessToken, authenticateToken } = require('../utils/auth'); 

/* GET pedidos listing. */
router.get('/', async function(req, res, next) {
  try {
    const pedidos = await prisma.pedido.findMany();
    res.json(pedidos);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

BigInt.prototype.toJSON = function() {
  return this.toString();
};

function generateOrderCode() {
  return Math.floor(Math.random() * 900000000) + 100000000; // Gera um número aleatório de 9 dígitos
}

router.post('/pedido/:ingressoId/:clienteId', authenticateToken, async (req, res) => {
  const ingressoId = Number(req.params.ingressoId);
  const clienteId = Number(req.params.clienteId);
  const { valorPago, ingressoUsado, ingressoTipo } = req.body;

  try {
    // Verifica se o cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });

    if (!cliente) {
      return res.status(400).json({ error: 'Cliente não encontrado.' });
    }

    // Verifica se o ingresso está disponível
    const ingresso = await prisma.ingresso.findFirst({
      where: {
        id: ingressoId,
        ingresso_disponivel: {
          gt: '0'
        }
      }
    });

    if (!ingresso) {
      return res.status(400).json({ error: 'Ingresso não disponível ou não encontrado.' });
    }

    // Gerar código de pedido aleatório
    const codigoPedido = generateOrderCode().toString();

    // Cria o pedido
    const pedido = await prisma.pedido.create({
      data: {
        data: new Date().toISOString(),
        valorPago: valorPago.toString(), // Convertendo valorPago para string
        ingressoUsado,
        ingressoTipo,
        codigoPedido, // Adicionando o código de pedido
        cliente: { connect: { id: clienteId } },
        ingresso: { connect: { id: ingressoId } },
      }
    });

    // Atualiza a disponibilidade do ingresso
    await prisma.ingresso.update({
      where: { id: ingressoId },
      data: { ingresso_disponivel: (parseInt(ingresso.ingresso_disponivel) - 1).toString() } // Convertendo para string
    });


    const pedidoCompleto = await prisma.pedido.findUnique({
      where: { id: pedido.id },
      include: {
        cliente: true,
        ingresso: true
      }
    });

    // Gerar e incluir o accessToken na resposta usando a função padronizada
    const accessToken = generateAccessToken({ clientId: clienteId, orderId: pedido.id });

    res.status(201).json({ ...pedido, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o pedido.' });
  }
});

/* GET pedido by id */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pedido = await prisma.pedido.findUniqueOrThrow({
      where: { id: id }
    });
    res.json(pedido);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});





/* PATCH pedido by id */
router.patch('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const pedido = await prisma.pedido.update({
      where: { id: id },
      data: data
    });
    res.json(pedido);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

/* DELETE pedido by id */
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pedido = await prisma.pedido.delete({
      where: { id: id }
    });
    res.status(204).end();
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

/* Generate barcode for pedido by id */
router.get('/barcode/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const pedido = await prisma.pedido.findUniqueOrThrow({
      where: { id: id }
    });

    // Concatenar as informações do pedido em uma string
    const barcodeData = `${pedido.id};${pedido.clienteId};${pedido.valorPago}`;

    // Criar um canvas para o código de barras
    const canvas = createCanvas();
    JsBarcode(canvas, barcodeData, { format: "CODE128" });

    // Enviar a imagem do código de barras como resposta
    res.type('image/png');
    canvas.createPNGStream().pipe(res);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});



router.all('*', (req, res) => {
  res.status(501).end();
});

module.exports = router;
