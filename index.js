//Obtendo o Express
const express = require('express')
var app = express()

//definimos a rota pública do frontend
app.use(express.static('public'));

//Iremos ouvir o servidor na porta especificada
app.listen(3001, function(){
    console.log(`\n Servidor Web do Front End rodando na porta 3001`)
})