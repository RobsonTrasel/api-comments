import { Request, Response } from "express";
import { Comment } from "../../models/comment";

class CommentsController {
  async getComments(req: Request, res: Response) {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const comments = await Comment.getComments(limit, offset)
    res.status(200).json(comments);
  }

  async createComments(req: Request, res: Response) {
    const { name, comment } = req.body;

    console.log(name, comment);

    if (!name) {
      return res.status(400).json({ error: "Nome é obrigatorio" });
    } else if (!comment) {
      return res.status(400).json({ error: "Comentario é obrigatorios" });
    }

    const result = await Comment.createComment(name, comment)
    res.status(201).send(result);
  }

  async setApproved(req: Request, res: Response) {
    const result = await Comment.setApproved(req.body.commentId)
    res.status(200).send(result)
  }

  async setRejected(req: Request, res: Response) {
    const result = await Comment.setRejected(req.body.commentId)
    res.status(200).send(result)
  }
}

export default new CommentsController();
