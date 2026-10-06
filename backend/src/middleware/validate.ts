import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
export const validate = (schema: z.ZodType) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Route schemas may contain path parameters (for example `{ id, status }`)
    // as well as request-body fields. Validate the complete input while
    // keeping params and body separate for downstream handlers.
    const parsed = schema.parse({ ...req.params, ...req.body }) as Record<string, unknown>;
    const paramKeys = Object.keys(req.params);
    req.params = Object.fromEntries(paramKeys.map((key) => [key, parsed[key] ?? req.params[key]])) as Request['params'];
    const parsedBody = Object.fromEntries(Object.entries(parsed).filter(([key]) => !paramKeys.includes(key)));
    req.body = { ...req.body, ...parsedBody };
    next();
  } catch (error) { next(error); }
};
