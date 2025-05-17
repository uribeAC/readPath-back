import { Model } from "mongoose";
import { NextFunction } from "express";
import { BookStructure } from "../types.js";
import {
  BookControllerStructure,
  BookRequest,
  BookResponse,
  BooksResponse,
} from "./types.js";
import statusCodes from "../../globals/statusCodes.js";
import ServerError from "../../server/ServerError/ServerError.js";
import {
  error404BookNotFound,
  error409BookExists,
  error500NotUpdate,
} from "../../server/ServerError/data.js";

class BookController implements BookControllerStructure {
  private readonly checkBookState = async (
    next: NextFunction,
    bookId: string,
    actualState: "read" | "to read",
  ): Promise<void> => {
    const book = await this.bookModel.findById(bookId).exec();

    if (!book) {
      next(error404BookNotFound);

      return;
    }

    if (book.state === actualState) {
      const error = new ServerError(
        statusCodes.CONFLICT,
        `Book is already marked as ${actualState}`,
      );

      next(error);
    }
  };

  private readonly updateBook = async (
    bookId: string,
    state: "read" | "to read",
  ): Promise<BookStructure | null> => {
    const updatedBook = await this.bookModel.findByIdAndUpdate(
      bookId,
      {
        state,
      },
      { new: true },
    );

    return updatedBook;
  };

  constructor(private readonly bookModel: Model<BookStructure>) {}

  public getBooks = async (
    req: BookRequest,
    res: BooksResponse,
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
    res: BookResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { bookId } = req.params;

    await this.checkBookState(next, bookId, "read");

    const updatedBook = await this.updateBook(bookId, "read");

    if (!updatedBook) {
      next(error500NotUpdate);
      return;
    }

    res.status(statusCodes.OK).json({ book: updatedBook });
  };

  public markAsToRead = async (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { bookId } = req.params;

    await this.checkBookState(next, bookId, "to read");

    const updatedBook = await this.updateBook(bookId, "to read");

    if (!updatedBook) {
      next(error500NotUpdate);

      return;
    }

    res.status(statusCodes.OK).json({ book: updatedBook });
  };

  public addBook = async (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { book } = req.body;

    const databaseBook = await this.bookModel
      .findOne({ title: book.title })
      .exec();

    if (databaseBook) {
      next(error409BookExists);

      return;
    }

    if (book.state === "to read") {
      delete book.yourRating;
      delete book.readDates;
    }

    const addedBook = await this.bookModel.insertOne(book);

    res.status(statusCodes.CREATED).json({ book: addedBook });
  };

  public deleteBook = async (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { bookId } = req.params;

    const deletedBook = await this.bookModel.findOneAndDelete({ _id: bookId });

    if (!deletedBook) {
      next(error404BookNotFound);

      return;
    }

    res.status(statusCodes.OK).json({ book: deletedBook });
  };
}

export default BookController;
