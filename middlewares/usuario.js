import jwt from 'jsonwebtoken'
const segredoJwt = process.env.SEGREDO_JWT

const validarToken = (req, res, next) => {
  try {
    const autorizacao = req.headers.authorization

    if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
      return res.status(401).send({ mensagem: 'Token não fornecido ou inválido' })
    }

    const token = autorizacao.split(' ')[1]
    const conteudoDoToken = jwt.verify(token, segredoJwt)

    req.id_usuario = conteudoDoToken.idUsuario
    next()
  } catch (erro) {
    return res.status(403).send({ mensagem: 'Token inválido ou expirado' })
  }
}

export { validarToken }
