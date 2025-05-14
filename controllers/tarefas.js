import { Tarefa } from '../models/Tarefa.js'

const registrarTarefa = async (req, res) => {
    try {
        const id_usuario = req.id_usuario
        const { descricao } = req.body
        if(!descricao || !id_usuario) {
            res.status(400).send({ mensagem: 'Dados incompletos '})
        }
        // Rodar create no model de Tarefa
        await Tarefa.create({ descricao, id_usuario })
        res.status(201).send({ mensagem: 'Tarefa criada'})        
    } catch(err) {        
        res.status(500).send({ mensagem: 'Ocorreu um erro inesperado'})
    }
}

const listarTarefa = async (req, res) => {    
    try {
        // Rodar findAll no model de Tarefa
        const id_usuario = req.id_usuario
        const tarefas = await Tarefa.findAll({ where: { id_usuario }})
        res.status(200).send({ tarefas })
    } catch (err) {
        res.status(500).send({ mensagem: 'Ocorreu um erro inesperado'})
    }
}

const excluirTarefa = async (req, res) => {
    try {
        // id do usuario que veio no token
        const id_usuario = req.id_usuario
        const { id } = req.params
        // Garantir que a tarefa que o usuario quer excluir, é dele e existe
        // Buscar tarefa no banco de dados pelo id        
        
        // Forma 1 - direto
        // await Tarefa.destroy({ where: { id, id_usuario }}
        // res.status(200).send({ mensagem: 'Tarefa excluida com sucesso'})

        // Forma 2 - com mais detalhes
        const tarefa = await Tarefa.findByPk(id)
        if(tarefa.id_usuario === id_usuario  ){
            // A tarefa é do mesmo usuario que chamou a requisição
            await Tarefa.destroy({ where: { id, id_usuario }})
            res.status(200).send({ mensagem: 'Tarefa excluida com sucesso'})
        } else {
            // Tarefa nao é do mesmo usuario
            res.status(404).send({ mensagem: 'Essa tarefa pertence a outro usuario'})
        }
    } catch (err) {
        res.status(500).send({ mensagem: 'Ocorreu um erro inesperado'})
    }
}

const atualizarTarefa = async (req, res) => {

    try {
        const id_usuario = req.id_usuario
        const { descricao } = req.body
        const {id} = req.params

        if(!descricao || !id_usuario) {
            res.status(400).send({ mensagem: 'Dados inesistentes'})
        }

        const tarefa = await Tarefa.findByPk(id)
        if (!tarefa) {
            return res.status(404).send({ mensagem: 'Tarefa não encontrada' })
        }

        if(tarefa.id_usuario !== id_usuario){
            return res.status(403).send({ mensagem: 'Essa tarefa pertence a outro usuário' })
        }
 
        await Tarefa.update({descricao}, {where:{ id, id_usuario } })
        
        res.status(201).send({ mensagem: 'Tarefa atualizada'}) 
        
        
    } catch(err) {        
        res.status(500).send({ mensagem: 'Ocorreu um erro inesperado'})
    }

    
}
export { registrarTarefa, listarTarefa, excluirTarefa, atualizarTarefa }