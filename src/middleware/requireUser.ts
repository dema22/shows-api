import { Request, Response, NextFunction } from "express";

// We want to make sure the user is required, so
// we are going to use this middleware for protected routes.
const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send({message: "You are not allowed to access this resource."});
  }
  return next();
};
export default requireUser;