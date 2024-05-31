
var express = require('express');
var router = express.Router();

const { PrismaClient} = require ('@prisma/client');


const prisma = new PrismaClient({errorFormat: "minimal"});

const {exceptionHandler} = require('../utils/ajuda');


/* GET users listing. */
router.get('/', async function(req, res, next) {
 try {
    const pedidos = await prisma.pedido.findMany();
    res.json(pedidos);
 }
 catch (exception){
  exceptionHandler(exception, res);

 }
});


BigInt.prototype.toJSON = function() {
  return this.toString();
};


router.post('/', async (req, res) => {
  const { ingressoId, clienteId, valorPago, ingressoUsado, ingressoTipo } = req.body;

  try {
    const pedido = await prisma.pedido.create({
      data: {
        ingressoId: parseInt(ingressoId),
        clienteId: parseInt(clienteId),
        valorPago: parseFloat(valorPago),
        ingressoUsado: ingressoUsado,
        ingressoTipo: ingressoTipo
      },
    });
    res.status(201).json(pedido);
  } catch (exception) {
    console.error(exception);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

/* get / api/users/{id} - obtem usuario por id */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pedido = await prisma.pedido.findUniqueOrThrow({
      where: {
        id: id
      }
    });
    res.json(pedido);
  }
  catch (exception) {
    exceptionHandler(exception, res);
  }
});


// 

router.patch('/:id' , async (req, res) =>{
  try{
    const id = Number(req.params.id);
    const data = req.body;
    const pedido = await prisma.pedido.update({
      where: {
        id: id
      },
      data: data
    });
    res.json(pedido);
  }
  catch(exception){
    exceptionHandler(exception, res)
  }
});

router.delete('/:id' , async (req, res) => {
  try{
    const id = Number(req.params.id);
    const pedido = await prisma.pedido.delete({
      where: {
        id: id
      }
    });
    res.status(204).end(); 
  }
  catch(exception){
    exceptionHandler(exception, res)
  }
});



router.post('/pedido/:ingressoId/:clienteId', async (req, res) => {
  try {
    const ingressoId = Number(req.params.ingressoId);
    const clienteId = Number(req.params.clienteId);
    const { valorPago, ingressoUsado, ingressoTipo } = req.body;

    const ingresso = await prisma.ingresso.findUnique({
      where: { id: ingressoId }
    });
    if (!ingresso || ingresso.ingresso_disponivel !== "sim") {
      return res.status(400).json({ error: "Ingresso não disponível ou não encontrado." });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });
    if (!cliente) {
      return res.status(400).json({ error: "Cliente não encontrado." });
    }

    const pedido = await prisma.pedido.create({
      data: {
        data: new Date(),
        valorPago: parseFloat(valorPago),
        ingressoUsado,
        ingressoTipo,
        cliente: { connect: { id: clienteId } },
        Ingresso: { connect: { id: ingressoId } }
      }
    });

    res.status(201).json(pedido);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});


// Supondo que você está usando Express.js no backend










//resposta padrao para rotas que nao existem 

router.all('*', (req, res) => {
  res.status(501).end();
})


module.exports = router;
