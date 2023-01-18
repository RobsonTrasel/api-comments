import * as pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const connectString = process.env.DB_URL
const client = new pg.Client(connectString)

client.connect((err) => {
    if(err) {
        return console.error('[Database] erro ao conectar ao database', err)
    }
})

export default client