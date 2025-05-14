import jwt from 'jsonwebtoken'
const segredoJwt = process.env.SEGREDO_JWT

const validarToken = (req, res, next) => {
    try {
        // Importar o token que virá no header da requisição
        const { token } = req.headers
        if(!token) {
            return res.status(404).send({ mensagem: 'Acesso negado' })
        }
        // Se tiver token, usaremos o pacote jwt para validá-lo (verifica se nao expirou, se foi gerado com o mesmo segredo e pela mesma API)
        const conteudoDoToken = jwt.verify(token, segredoJwt)
        // Identificar a qual usuario o token foi gerado 
        const id_usuario = conteudoDoToken.idUsuario
        // Registrar na requisição o id identificado
        req.id_usuario = id_usuario
        next()
    } catch(erro){
        res.status(404).send({ mensagem: 'Acesso negado' })
    }    
}


export { validarToken }