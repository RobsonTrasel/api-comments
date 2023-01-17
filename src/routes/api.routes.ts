import express, {Request, Response} from 'express'
import multer from 'multer'
import client  from '../data/connections/database.config'

const router = express.Router()
const upload = multer({
    dest: '.uploads/'
})

router.get('/comments', async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    try {
        const result = await client.query(`SELECT * FROM comments WHERE status = 'aprovado' LIMIT ${limit} OFFSET ${offset}`);
        res.status(200).json(result.rows);
      } catch (err) {
        console.log(err);
        res.status(500);
      }
})

router.post('/comments', upload.single('photo'), async (req: Request, res: Response) => {
    try {
        const {
            name, comment
        } = req.body

        if (!name) {
            return res.status(400).json({ error: 'Nome é obrigatorio' });
        } else if(!comment) {
            return res.status(400).json({ error: 'Comentario é obrigatorios' });

        }

        const photo = req.file ? req.file.filename : null
        const sql = 'INSERT INTO comments (name, comment, photo) VALUES ($1, $2, $3)'
        const values = [
            name, comment, photo
        ]
        await client.query(sql, values)
        res.status(201).send({
            message: "Comentario criado com sucesso!"
        })
    } catch (error) {
        res.status(500).send({
            message: "Erro ao criar comentario!"
        })
    }
})

router.put('/comments/approve/:id', async (req: Request, res: Response) => {
    const commentId = req.params.id
    try {
        const result = await client.query(`SELECT status FROM comments WHERE id = ${commentId}`)

        if(result.rows[0].status === 'pendente') {
            await client.query(`UPDATE comments SET status = 'aprovado' WHERE id = ${commentId}`);
            res.status(200).send('Comentario foi aprovado com sucesso!');
        } else {
            res.status(400).send('Comentario ja foi aprovado!')
        }       
      } catch (err) {
        console.log(err);
        res.status(500).send();
    }
})


export default router