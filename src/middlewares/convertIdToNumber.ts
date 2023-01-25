import { Request, Response, NextFunction } from "express"

export const convertIdToNumber = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const commentId = Number(req.params.id)
    req.body.id = commentId;
    next()
}