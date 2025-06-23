import type { RequestHandler, Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod/v4";

type ValidateOptions<P = unknown, B = unknown, Q = unknown, Res = unknown> = {
  body?: ZodType<B>;
  params?: ZodType<P>;
  query?: ZodType<Q>;
  response?: ZodType<Res>;
};

type Error = {
  error: string;
};

export const validate = <Res = unknown, P = unknown, B = unknown, Q = unknown>(
  schemas: ValidateOptions<P, B, Q, Res>,
): RequestHandler<P, Res | Error, B, Q> => {
  return (
    req: Request<P, Res, B, Q>,
    res: Response<Res | Error>,
    next: NextFunction,
  ) => {
    try {
      if (schemas.body) {
        schemas.body.parse(req.body);
      }
      if (schemas.params) {
        schemas.params.parse(req.params);
      }
      if (schemas.query) {
        schemas.query.parse(req.query);
      }
      next();
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        console.log(e);
        const errorMessage = e.issues
          .map((issue) => `${issue.path.join(".")} ${issue.message}`)
          .join(", ");
        res.status(400).json({
          error: errorMessage,
        });
      } else {
        console.error(e);
        res.status(500).json({
          error: "Internal server error",
        });
      }
    }
  };
};

// validate({
//         params: GetUserRequestParamSchema,
//         response: UserSchema,
//     }),

// validate({
//         body: BodySchema,
//         response: UserSchema,
//     }),
