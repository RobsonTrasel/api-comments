import { Request, Response } from "express";
import client from '../../data/connections/database.config'

class CommentsController {
    
    async getComments(req: Request, res: Response) {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;
        try {
            const result = await client.query(`SELECT * FROM comments WHERE status = 'aprovado' LIMIT ${limit} OFFSET ${offset}`);
            res.status(200).json(result.rows);
        } catch(err) {
            console.log(err)
            res.status(500)
        }
    }

    async createComments(req: Request, res: Response) {
        try {
            const {
                name, comment
            } = req.body

            console.log(name, comment)

            if (!name) {
                return res.status(400).json({ error: 'Nome é obrigatorio' });
            } else if(!comment) {
                return res.status(400).json({ error: 'Comentario é obrigatorios' });
            }

            const sql = 'INSERT INTO comments (name, comment) VALUES ($1, $2)'
            const values = [
                name, comment
            ]
            await client.query(sql, values)
            res.status(201).send({
                message: "Comentario criado com sucesso!"
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                message: 'Erro ao criar comentario'
            })
        }
    }

    async setApproved(req: Request, res: Response) {
        const commentId = req.params.id
        try {
            const result = await client.query(`SELECT status FROM comments WHERE id = ${commentId}`)

            if(result.rows[0].status === 'pendente') {
                await client.query(`UPDATE comments SET status = 'aprovado' WHERE id = ${commentId}`);
                res.status(200).send('Comentario foi aprovado com sucesso!');
            } else {
                res.status(400).send('Comentario ja foi aprovado ou rejeitado')
            }       
        } catch (err) {
            console.log(err);
            res.status(500).send();
        }
    }

    async setRejected(req: Request, res: Response) {
        const commentId = req.params.id;
        try {
            const result = await client.query(`SELECT status FROM comments WHERE id = ${commentId}`);
            if (result.rows[0].status === 'pendente') {
            await client.query(`UPDATE comments SET status = 'rejected' WHERE id = ${commentId}`);
            res.status(200).send('Comentario foi rejeitado com sucesso');
            } else {
            res.status(400).send('Comentario ja foi aprovado ou rejeitado');
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }


}

export default new CommentsController()