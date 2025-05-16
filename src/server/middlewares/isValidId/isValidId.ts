import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import ServerError from "../../ServerError/ServerError.js";
import { BookRequest } from "../../../book/controller/types.js";

const isValidId = async (
  req: BookRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const { bookId } = req.params;

  const isValidId = mongoose.isValidObjectId(bookId);

  if (!isValidId) {
    const error = new ServerError(400, "Id not valid");

    next(error);

    return;
  }

  next();
};

export default isValidId;
