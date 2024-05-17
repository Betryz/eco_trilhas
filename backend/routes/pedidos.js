
var express = require('express');
var router = express.Router();

const { PrismaClient} = require ('@prisma/client');


const prisma = new PrismaClient({errorFormat: "minimal"});

const {exceptionHandler} = require('../utils/ajuda');


/* GET users listing. */
router.get('/', async function(req, res, next) {
 try {
    const pedidos = await prisma.pedido.findMany();
    res.json({pedidos});
 }
 catch (exception){
  exceptionHandler(exception, res);

 }
});

router.post('/' , async (req, res) => {
  const data = req.body;

  try{
    const pedido = await prisma.pedido.create({
      data: data,
    });
    res.status(201).json(pedido);
  
  }
  catch(exception ){
    exceptionHandler(exception, res);


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

router.post('/pedido/:pedido_id/:cliente_id' , async(req, res) => {
  try{
      const pedidoId = Number(req.params.pedido_id);
      const clienteId = Number(req.params.cliente_id);

      const pedido = await prisma.pedido.findUniqueOrThrow({
          where: {
              id: pedidoIdId
          }
      });
      const cliente = await prisma.cliente.findUniqueOrThrow({
          where: {
              id: clienteIdId
          }
      });

  const aluguelFilme = await prisma.alugaFilme.create({
      data: {
          pedidoId: pedido.id,
          clienteId: cliente.id
      }
  });
  res.status(201).json(aluguelFilme);
  

} catch(exception){
  exceptionHandler(exception, res);
}


}  )



//resposta padrao para rotas que nao existem 

router.all('*', (req, res) => {
  res.status(501).end();
})


module.exports = router;
