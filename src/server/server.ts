import express from 'express'
import router from '../routes/api.routes'

const app = express()
app.use(express.json())
app.use('/api', router)
app.listen(3000, () => {
    console.log('[Server] iniciado com sucesso')
})