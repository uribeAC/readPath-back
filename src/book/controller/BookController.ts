import { Model } from "mongoose";
import { BookStructure } from "../types.js";
import { BookControllerStructure, BookRequest, BookResponse } from "./types.js";
import statusCodes from "../../globals/statusCodes.js";
import { NextFunction, Response } from "express";
import ServerError from "../../server/ServerError/ServerError.js";

class BookController implements BookControllerStructure {
  constructor(private readonly bookModel: Model<BookStructure>) {}

  public getBooks = async (
    req: BookRequest,
    res: BookResponse,
  ): Promise<void> => {
    let pageNumber = req.query.page;

    if (!pageNumber) {
      pageNumber = "1";
    }

    const booksPerPageNumber = 10;
    const booksToSkipNumber = (Number(pageNumber) - 1) * booksPerPageNumber;

    const booksTotal = await this.bookModel.countDocuments();
    const booksReadTotal = await this.bookModel
      .where({
        state: "read",
      })
      .countDocuments();

    const booksToReadTotal = booksTotal - booksReadTotal;

    const books = await this.bookModel
      .find()
      .sort({ firstPublished: "descending" })
      .skip(booksToSkipNumber)
      .limit(booksPerPageNumber)
      .exec();

    res.status(statusCodes.OK).json({
      books: books,
      totals: {
        books: booksTotal,
        booksRead: booksReadTotal,
        booksToRead: booksToReadTotal,
      },
    });
  };

  public markAsRead = async (
    req: BookRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const bookId = req.params.bookId;

    const book = await this.bookModel.findById(bookId).exec();

    if (!book) {
      const error = new ServerError(statusCodes.NOT_FOUND, "Book not found");

      next(error);

      return;
    }

    if (book.state === "read") {
      const error = new ServerError(
        statusCodes.CONFLICT,
        "Book is already marked as Read",
      );

      next(error);

      return;
    }

    const updatedBook = await this.bookModel.findByIdAndUpdate(bookId, {
      state: "read",
    });

    res.status(statusCodes.OK).json({ book: updatedBook });
  };
}

export default BookController;
