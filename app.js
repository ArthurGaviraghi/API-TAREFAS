import express from 'express'
// Permitir todas as origens (mais comum em dev)
import cors from 'cors';

// importar o dotenv
import 'dotenv/config'
import { router } from './rotas/usuario.js'
import { routerTarefa } from './rotas/tarefas.js'
import { database } from './database.js'

const app = express()
app.use(cors({
  origin: ['http://localhost:5173', 'https://gestao-puce.vercel.app']
}));

app.use(express.json())
app.use(router)
app.use(routerTarefa)

await database.sync()

app.listen(5000, () => console.log('servidor rodando'))
