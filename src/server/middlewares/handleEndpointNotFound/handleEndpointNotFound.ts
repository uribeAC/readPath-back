import { NextFunction, Request, Response } from "express";
import ServerError from "../../ServerError/ServerError.js";
import statusCodes from "../../../globals/statusCodes.js";

const handleEndpointNotFound = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const error = new ServerError(statusCodes.NOT_FOUND, "Endpoint not found");

  next(error);
};

export default handleEndpointNotFound;
