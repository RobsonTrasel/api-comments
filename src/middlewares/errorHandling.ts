import { Request, Response, NextFunction } from 'express';

interface errorBody {
    status: number;
    message: string;
    stack?: string;
}

export const errorHandler = (
    err: Error | any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    const body: errorBody = {
        status,
        message,
    }

    if (process.env.NODE_ENV === 'development' && err instanceof Error) {
        body.stack = err.stack;
    }

    res.status(status).json(body);
}