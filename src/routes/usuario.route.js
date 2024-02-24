
/**************************************************************************************
*   Nome da variavel: rota;                                                           *  
*   Descrição: Uma variavel que armazena o parametro "Router", dando a capacidade     *  
*   de usarmos a "função" Router do express fora deste script e na variavel "rota".   *                  
***************************************************************************************/

const rota = require('express').Router();

/************************************************************************************
*   Nome da variavel: usuarioController;                                            *
*   Descrição: Uma variavel que importa a função "UsuarioController" do controllers *
*   para que possamos usar as funções neste script.                                 * 
*************************************************************************************/

const usuarioController = require('../controllers/usuario.controller');

/*************************************************************************************
*   Nome da variavel: rota;                                                          *
*   Descrição: Define o metodo e rota na qual será usada para chamar a função, sendo *
*   ela a de criação "criarUso" ou até a de pesquisar um usuario existente "pesUsu"  *
*   do controller.                                                                   *           
**************************************************************************************/

rota.post("/", usuarioController.criarUsu);
rota.get("/", usuarioController.pesUsu)
rota.get("/:id", usuarioController.pesUsuId)
rota.patch("/:id", usuarioController.UsuUpdate)

//  Exporta a variavel rota que irá ser chamada pelo controller.
module.exports = rota;