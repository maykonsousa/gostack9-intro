import express from 'express'

const server = express();
server.use(express.json());
const users = ['Maykon','Thalita','Louise'];

//Middleware global
//Imprime no terminal qual o método foi chaado e o tempo de execução
server.use((req,res,next)=>{
  console.time('tempo de requisição:');
  console.log(`Método: ${req.method};`);
  console.log(`URL: ${req.url};`);
  next();
  console.timeEnd('tempo de requisição:');
})

//Middlewares locais

// ** Verifica se o nome do usuário foi enviado
function nameRequired (req, res,next){
  if(!req.body.name){
    return res.status(400).json({error:'Necessário enviar o nome do usuário'});
  }
  return next();
}

// ** verifica se o usuário informado existe
function checkUserExists (req, res,next){
  if(!users[req.params.index]){
    return res.status(401).json({error:'Usuário inexistente'})
  }
  return next();
}

//rota de teste
server.get('/', (req,res)=>{
  return res.json({message:'Testando aplicação'})
})

//Listar todos os usuários
server.get('/users', (req,res)=>{
  return res.json(users)
})

//listar um único usuário
server.get('/users/:index', checkUserExists, (req,res)=>{
  const {index} = req.params;
  return res.json({message:`O usuário ${index} se chama ${users[index]}`})
})

//Criar um usuário
server.post('/users',nameRequired, (req,res)=>{
  const {name} = req.body;
  users.push(name);
  return res.json({message:`Usuário ${name} criado com sucesso!`})
})

//Alterar um usuário
server.put('/users/:index',nameRequired, checkUserExists, (req,res)=>{
  const {index} = req.params;
  const oldname = users[index]
  const {name} = req.body;
  users[index]=name;
  return res.json({message:`Nome do usuário ${index} alterado de ${oldname} para ${name}.`})
})

//Deletar um usuário
server.delete('/users/:index', checkUserExists, (req, res)=>{
  const {index}= req.params;
  const user = users[index];
  users.splice(index, 1);
  return res.json({message:`Usuário ${user} deletado com sucesso!`})
})



server.listen(3000)


