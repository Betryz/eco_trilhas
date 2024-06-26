var express = require('express');
var router = express.Router();

const {PrismaClient} = require ('@prisma/client');


const prisma = new PrismaClient({errorFormat: "minimal"});
const bcrypt = require('bcryptjs');

const {exceptionHandler} = require('../utils/ajuda');
const { generateAccessToken, authenticateToken} = require('../utils/auth');


/* GET users listing. */
router.get('/', async function(req, res, next) {
 try {
    const funcionarios = await prisma.funcionario.findMany();
    res.json(funcionarios);
 }
 catch (exception){
  exceptionHandler(exception, res);

 }
});

router.post('/', async (req, res) => {
  const data = req.body;




  if (!data.password || data.password.length < 8) {
    return res.status(400).json({
      error: "A senha é obrigatória e deve ter no mínimo 8 caractere"
    });

  }

  data.password = await bcrypt.hash(data.password, 10);
  try {
    const funcionario = await prisma.funcionario.create({
      data: {
        ...data,
        nascimento: new Date(data.nascimento) // Assegura que nascimento seja um Date
      },

      data: data,
      select: {
        id: true,
        nome: true,
        cpf: true,
        telefone: true, 
        email: true, 
        nascimento: true,
        password: true,
        

      }

    });
    const jwt = generateAccessToken(funcionario);
    funcionario.accessToken = jwt;
    res.status(201).json(funcionario);

  }
  catch (exception) {
    exceptionHandler(exception, res);


  }

});




/* get / api/users/{id} - obtem usuario por id */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const funcionario = await prisma.funcionario.findUniqueOrThrow({
      where: {
        id: id
      }
    });
    res.json(funcionario);
  }
  catch (exception) {
    exceptionHandler(exception, res);
  }
});


// 

router.patch('/:id' , authenticateToken , async (req, res) =>{
  try{
    const id = Number(req.params.id);
    const data = req.body;
    const token = req.accessToken;
    const checkFuncionario = await prisma.funcionario.findUnique({
      where: {
        id: id,
        email: token.email
      }
    })
    if(checkFuncionario === null || id !== token.id){
      return res.sendStatus(403);
    }
    if ('password' in data){
      if (data.password.length < 8){
          return res.status(400).json({
            error: "A senha deve ter no mínimo 8 caracteres"
          });
      }
      data.password = await bcrypt.hash(data.password, 10);

    }
    const funcionario = await prisma.funcionario.update({
      where: {
        id: id
      },
      data: data,
      select:{
        id: true,
        nome: true,
        email: true
      }
    });
    res.json(funcionario);
  }
  catch(exception){
    exceptionHandler(exception, res)
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const token = req.accessToken;

    const funcionario = await prisma.funcionario.findUnique({
      where: { id: id }
    });

    if (!funcionario || funcionario.email !== token.email || id !== token.id) {
      return res.sendStatus(403);
    }

    await prisma.funcionario.delete({
      where: { id: id }
    });

    res.status(204).end();
  } catch (exception) {
    console.error('Erro ao excluir funcionário:', exception.message);
    res.sendStatus(500);
  }
});





router.post('/login' , async (req, res ) =>{
  try{
    const data = req.body;
    if ((! 'password' in data) || (!'email' in data)){
      return res.status(401).json({
        error: "Usúario e senha são obrigatórios"
      });

    }
    const funcionario = await prisma.funcionario.findUnique({
      where: {
        email: data.email
      }

    })

    const passwordCheck = await bcrypt.compare(data.password, funcionario.password);

    if(!passwordCheck){
      return res.status(401).json({
        error: "Usuário e/ou senha incorreta(s)"

      });
    }

    delete funcionario.password;
    const jwt = generateAccessToken(funcionario);
    

    res.json({
      user: funcionario,
      token: jwt
    });

  }
  catch(exception){
    
      exceptionHandler(exception, res)
  }
})


//resposta padrao para rotas que nao existem 

router.all('*', (req, res) => {
  res.status(501).end();
})


module.exports = router;
