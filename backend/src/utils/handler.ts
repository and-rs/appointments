import { Request, Response, RequestHandler } from "express";

type HandlerOperation<T> = (req: Request, res: Response) => Promise<T>;

export default class HandlerFactory {
  static create<T>(
    operation: HandlerOperation<T>,
    errorMessage: string,
    successStatus: number = 200,
  ): RequestHandler {
    return async (req: Request, res: Response) => {
      try {
        const result = await operation(req, res);
        res.status(successStatus).json(result);
        console.log(`Success => ${req.method} ${req.baseUrl}${req.path}`);
      } catch (error) {
        console.error(`${errorMessage} => `, error);
        res.status(500).json({ error: errorMessage });
      }
    };
  }
}
