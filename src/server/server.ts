import express from 'express'
import router from '../routes/api.routes'
import { errorHandler } from '../middlewares/errorHandling';

const app = express()
app.use(express.json())
app.use(errorHandler)
app.use('/api', router)
app.listen(3000, () => {
    console.log('[Server] iniciado com sucesso')
})