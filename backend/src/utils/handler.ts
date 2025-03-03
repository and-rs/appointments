import { Request, Response, RequestHandler, NextFunction } from "express";

type HandlerOperation<T> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<T>;

type HandlerProps = {
  successStatus?: number;
  errorStatus?: number;
  errorMessage: string;
};

export default class HandlerFactory {
  static create<T>(
    operation: HandlerOperation<T>,
    { successStatus = 200, errorStatus = 500, errorMessage }: HandlerProps,
  ): RequestHandler {
    return async (req, res, next) => {
      try {
        const result = await operation(req, res, next);
        if (result) {
          res.status(successStatus).json(result);
        }
        console.log(`Success => ${req.method} ${req.baseUrl}${req.path}`);
      } catch (error) {
        console.error(`${errorMessage} =>`, error);
        res.status(errorStatus).json({ error: errorMessage });
      }
    };
  }
}
