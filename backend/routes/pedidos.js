var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ errorFormat: "minimal" });
const { exceptionHandler } = require('../utils/ajuda');
const { generateShortAccessToken, authenticateToken } = require('../utils/auth'); // Ajuste o caminho conforme necessário

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

router.post('/pedido/:ingressoId/:clienteId', authenticateToken, async (req, res) => {
  const ingressoId = Number(req.params.ingressoId);
  const clienteId = Number(req.params.clienteId);
  const { valorPago, ingressoUsado, ingressoTipo } = req.body;

  try {
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

    // Cria o pedido
    const pedido = await prisma.pedido.create({
      data: {
        data: new Date().toISOString(),
        valorPago: valorPago.toString(), // Convertendo valorPago para string
        ingressoUsado,
        ingressoTipo,
        cliente: { connect: { id: clienteId } },
        Ingresso: { connect: { id: ingressoId } }
      }
    });

    // Atualiza a disponibilidade do ingresso
    await prisma.ingresso.update({
      where: { id: ingressoId },
      data: { ingresso_disponivel: (parseInt(ingresso.ingresso_disponivel) - 1).toString() } // Convertendo para string
    });

    // Gerar e incluir o accessToken na resposta usando a função padronizada
    const accessToken = geerateShortAccessToken({ clientId: clienteId, orderId: pedido.id });

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

router.all('*', (req, res) => {
  res.status(501).end();
});

module.exports = router;
