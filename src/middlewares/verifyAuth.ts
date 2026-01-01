import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export const verifyAuth = (...Alowedroles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      //* if no session or user found
      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login first.",
        });
      }

      console.log(session);

      //* user role from session
      const userRole = session.user.role;

      console.log("user role :", userRole);

      //* check if user role is in allowed roles
      if (Alowedroles.length > 0 && !Alowedroles.includes(userRole as string)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden. You don't have permission to access this resource.",
        });
      }

      next();
    } catch (error) {
      console.error("VerifyAuth Error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  };
};
