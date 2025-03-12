import { NextFunction, Request, RequestHandler, Response } from "express";

type HandlerOperation<T, R> = (
  req: R,
  res: Response,
  next: NextFunction,
) => Promise<T>;

type HandlerProps = {
  successStatus?: number;
  errorStatus?: number;
  errorName: string;
};

export default class HandlerFactory {
  static create<T, R extends Request = Request>(
    operation: HandlerOperation<T, R>,
    { successStatus = 200, errorStatus = 500, errorName }: HandlerProps,
  ): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await operation(req as R, res, next);

        if (result) {
          res.status(successStatus).json({ success: true, result });
        }

        console.log(`Success => ${req.method} ${req.baseUrl}${req.path}`);
      } catch (error) {
        const { message } = error as Error;

        console.error(`${errorName} =>`, error);

        res.status(errorStatus).json({ error: errorName, message });
      }
    };
  }
}
