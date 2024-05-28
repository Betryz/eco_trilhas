
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
        ingressoUsado: BigInt(ingressoUsado),
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



router.post('/pedido/:ingresso_id/:cliente_id' , async(req, res) => {
  try {
    const ingressoId = Number(req.params.ingresso_id);
    const clienteId = Number(req.params.cliente_id);

    const { preco, ingressosUsados, tipoIngresso } = req.body;

    if (isNaN(preco)) {
      return res.status(400).json({ error: "O preço deve ser um número válido." });
    }

    const ingresso = await prisma.ingresso.findUniqueOrThrow({
      where: { id: ingressoId }
    });
    const cliente = await prisma.cliente.findUniqueOrThrow({
      where: { id: clienteId }
    });

    const pedido = await prisma.pedido.create({
      data: {
        ingressoId: ingresso.id,
        clienteId: cliente.id,
        valorPago: parseFloat(preco),
        tipoIngresso,
        ingressosUsados: parseInt(ingressosUsados, 10)
      }
    });

    res.status(201).json(pedido);
  } catch (exception) {
    exceptionHandler(exception, res);
  }

}  )





//resposta padrao para rotas que nao existem 

router.all('*', (req, res) => {
  res.status(501).end();
})


module.exports = router;
