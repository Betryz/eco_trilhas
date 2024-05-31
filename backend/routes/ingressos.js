var express = require('express');
var router = express.Router();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ errorFormat: "minimal" });
const bcrypt = require('bcryptjs');
const { exceptionHandler } = require('../utils/ajuda');
const { generateAccessToken, authenticateToken } = require('../utils/auth');

/* GET ingressos listing. */
router.get('/', async function (req, res, next) {
  try {
    const ingressos = await prisma.ingresso.findMany();
    res.json(ingressos);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

router.post('/', async (req, res) => {
  const data = req.body;

  // Certifique-se de que o valor de preco é um número decimal
  if (isNaN(data.preco)) {
    return res.status(400).json({ error: "O preço deve ser um número válido." });
  }
  
  try {
    const ingresso = await prisma.ingresso.create({
      data:data,
      
    });
  
    res.status(201).json(ingresso);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});




  
/* GET /api/ingressos/{id} - obtem ingresso por id */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ingresso = await prisma.ingresso.findUniqueOrThrow({
      where: {
        id: id
      },

    });
    res.json(ingresso);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.ingresso.delete({
      where: {
        id: id
      }
    });
    res.status(204).end();
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

// Supondo que você esteja usando Express.js no backend
router.get('/disponiveis/:data', async (req, res) => {
  try {
    const dataVisita = new Date(req.params.data);
    const ingressos = await prisma.ingresso.findMany({
      where: {
        data_disponivel: dataVisita,
        ingresso_disponivel: "sim" // Supondo que "sim" significa disponível
      }
    });
    res.json(ingressos);
  } catch (exception) {
    res.status(500).json({ error: "Erro ao buscar ingressos disponíveis" });
  }
});




// Resposta padrão para rotas que não existem
router.all('*', (req, res) => {
  res.status(501).end();
});

module.exports = router;
