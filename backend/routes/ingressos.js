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
    const jwt = generateAccessToken(ingresso);
    ingresso.accessToken = jwt;
    res.status(201).json(ingresso);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

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


router.get('/disponiveis/:data', async (req, res) => {
  try {
    let dataVisita = req.params.data;
    
    // Verificar se a data está no formato esperado (YYYY-MM-DD)
    if (!isValidISODate(dataVisita)) {
      return res.status(400).json({ error: "Formato de data inválido. Use o formato YYYY-MM-DD." });
    }
    
    // Convertendo a data para o formato ISO-8601 completo
    dataVisita += 'T00:00:00Z';

    const ingressosDisponiveis = await prisma.ingresso.findMany({
      where: {
        data_disponivel: new Date(dataVisita), // Convertendo para objeto Date
        ingresso_disponivel: {
          gt: '0' // Convertendo para string
        }
      }
    });
    res.json(ingressosDisponiveis);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

// Função para verificar se uma string está no formato de data ISO-8601 (YYYY-MM-DD)
function isValidISODate(dateString) {
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  return isoRegex.test(dateString);
}






// Resposta padrão para rotas que não existem
router.all('*', (req, res) => {
  res.status(501).end();
});

module.exports = router;
