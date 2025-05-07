import { Request, Response } from "express";

const handleHealthCheck = (_req: Request, res: Response): void => {
  res.status(200).json({ message: "pong 🏓" });
};

export default handleHealthCheck;
