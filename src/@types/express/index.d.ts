import "express";

declare module "express-serve-static-core" {
  interface User {
    id: string;
    email: string;
    role?: string;
    name?: string;
  }
}
declare module "express" {
  interface Request {
    user?: User;
  }
}
