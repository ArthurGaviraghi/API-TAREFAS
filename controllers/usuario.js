import { Usuario } from "../models/Usuario.js"
import jwt from 'jsonwebtoken'
// Segredo usado pra gerar e validar token JWT
const segredoJwt = process.env.SEGREDO_JWT

const registrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body
        if (!nome || !email || !senha) {
            return res.status(400).send({ mensagem: 'Dados incompletos' })
        }
        const usuarioExistente = await Usuario.findOne({ where: { email } })
        if (usuarioExistente) {
            return res.status(400).send({ mensagem: 'Usuário já existe' })
        }
        await Usuario.create({ nome, email, senha })
        res.status(201).send({ mensagem: 'Usuario foi criado' })
    } catch (erroDisparado) {
        console.log(erroDisparado)
        res.status(500).send({ mensagem: 'Ocorreu um erro inesperado' })
    }
}

const autenticarUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body
        if (!email || !senha) {
            return res.status(400).send({ mensagem: 'Dados incompletos' })
        }
        // Buscar dados do usuario que está tentando fazer login 
        const buscarUsuarioPorEmail = await Usuario.findOne({ where: { email } })
        if (!buscarUsuarioPorEmail) {
            return res.status(404).send({ mensagem: 'Usuário não encontrado' })
        }
        // Se usuario existir, precisamos confirmar se a senha está correta
        const senhaQueEstaNoBanco = buscarUsuarioPorEmail.senha
        const idUsuario = buscarUsuarioPorEmail.id
        if (senhaQueEstaNoBanco === senha) {
            // Senha correta, precisa gerar token
            const conteudoDoToken = { idUsuario }
            // Usar o metodo sign do jwt para gerar o token
            const token = jwt.sign(conteudoDoToken, segredoJwt, { expiresIn: '1d' })
            return res.status(201).send({ token })
        } else {
            // Senha incorreta
            return res.status(403).send({ mensagem: 'Credenciais inválidas' })
        }
    } catch (erro) {
        console.log(erro)
        res.status(500).send({ mensagem: 'Ocorreu um erro inesperado' })
    }
}

export { registrarUsuario, autenticarUsuario }