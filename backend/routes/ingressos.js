var express = require('express');
var router = express.Router();

const {PrismaClient} = require ('@prisma/client');


const prisma = new PrismaClient({errorFormat: "minimal"});

const {exceptionHandler} = require('../utils/ajuda');


/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const ingressos = await prisma.ingresso.findMany();
    res.json(ingressos);
  } catch (exception) {
    console.error(exception);
    res.status(500).json({ error: 'Erro ao obter ingressos' });
  }
});

router.post('/' , async (req, res) => {
  const data = req.body;

  try{
    const ingresso = await prisma.ingresso.create({
      data: data,
    });
    res.status(201).json(ingresso);
  
  }
  catch(exception){
    exceptionHandler(exception, res);


  }

});



/* get / api/users/{id} - obtem usuario por id */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ingresso = await prisma.ingresso.findUniqueOrThrow({
      where: {
        id: id
      }
    });
    res.json(ingresso);
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
    const ingresso = await prisma.ingresso.update({
      where: {
        id: id
      },
      data: data
    });
    res.json(ingresso);
  }
  catch(exception){
    exceptionHandler(exception, res)
  }
});

router.delete('/:id' , async (req, res) => {
  try{
    const id = Number(req.params.id);
    const ingresso = await prisma.ingresso.delete({
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

//resposta padrao para rotas que nao existem 

router.all('*', (req, res) => {
  res.status(501).end();
})


module.exports = router;
