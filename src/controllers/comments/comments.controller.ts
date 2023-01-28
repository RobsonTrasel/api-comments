import { Request, Response } from "express";
import { Comment } from "../../models/comment";

class CommentsController {
  /**
   * @function getComments - Retrieve a list of comments from the database
   * @async
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {void} - Sends a JSON object containing the list of commments of the client
   */
  async getComments(req: Request, res: Response) {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const comments = await Comment.getComments(limit, offset)
    res.status(200).send(comments);
  }

  /**
   * @function createComments - Create a new comment and store on the database
   * @async
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @description
   * This function is responsible for handling the request to create a new comment. It first checks if the name and comment fields are present in the request body, returning a status code 400 and an error message if they are missing. If the fields are present, it calls the createComment function from the Comment class to insert the new comment into the database, and sends a status code 201 and the result of the function call as a response to the client.
   */
  async createComments(req: Request, res: Response) {
    const { name, comment } = req.body;
    if (!name) {
      return res.status(400).send({ error: "Nome é obrigatorio" });
    } else if (!comment) {
      return res.status(400).send({ error: "Comentario é obrigatorios" });
    }

    const result = await Comment.createComment(name, comment)
    res.status(201).send(result);
  }
  /**
   * @function setApproved - Approve the comments for display on front home
   * @async
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @description Function responsible for approving a comment
   * @returns {Promise<Response>} Returns a promise of the HTTP response with the result of the operation
   * @example
   * const result = await CommentController.setApproved(req, res)
   * console.log(result)
   */
  async setApproved(req: Request, res: Response) {
    const id = Number(req.params.id)
    const result = await Comment.setApproved(id) 
    res.status(200).send(result)
  }

   /**
   * @function setRejected - Reject the comments for display on front home
   * @async
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @description Function responsible for rejecting a comment
   * @returns {Promise<Response>} Returns a promise of the HTTP response with the result of the operation
   * @example
   * const result = await CommentController.setRejected(req, res)
   * console.log(result)
   */
  async setRejected(req: Request, res: Response) {
    const id = Number(req.params.id)
    const result = await Comment.setRejected(id)
    res.status(200).send(result)
  }
}

export default new CommentsController();
