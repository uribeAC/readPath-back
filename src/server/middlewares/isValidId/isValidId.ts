import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import { BookDataRequest } from "../../../book/controller/types.js";
import { error400NotValidId } from "../../ServerError/data.js";

const isValidId = async (
  req: BookDataRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const { bookId } = req.params;

  const isValidId = mongoose.isValidObjectId(bookId);

  if (!isValidId) {
    next(error400NotValidId);

    return;
  }

  next();
};

export default isValidId;
