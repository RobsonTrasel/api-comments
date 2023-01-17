import * as pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const connecString = "postgres://dwrsjgut:9iacSXFQWwzNDTR-RxFUCN_03xZPiNS6@babar.db.elephantsql.com/dwrsjgut"
const client = new pg.Client(connecString)

client.connect((err) => {
    if(err) {
        return console.error('[Database] erro ao conectar ao database', err)
    }
})

export default client