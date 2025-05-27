import { Model } from "mongoose";
import { NextFunction, Request } from "express";
import { BookStructure } from "../types.js";
import {
  BookControllerStructure,
  BookDataRequest,
  BookRequest,
  BookResponse,
  BooksResponse,
  BookStatsMongoResponse,
  BookStatsResponse,
  QueryFilters,
} from "./types.js";
import statusCodes from "../../globals/statusCodes.js";
import ServerError from "../../server/ServerError/ServerError.js";
import {
  error404BookNotFound,
  error404ReadBooksNotFound,
  error409BookExists,
  error500NotUpdate,
} from "../../server/ServerError/data.js";
import { transformBookStatsMongoResponseToBookStats } from "../dto/transformers.js";

class BookController implements BookControllerStructure {
  constructor(private readonly bookModel: Model<BookStructure>) {}

  public getBooks = async (
    req: BookDataRequest,
    res: BooksResponse,
  ): Promise<void> => {
    let pageNumber = req.query.page;
    const state = req.query.state;
    const genre = req.query.genre;
    const queryFilters: QueryFilters = {};

    if (!pageNumber) {
      pageNumber = "1";
    }

    if (state) {
      queryFilters.state = state;
    }

    if (genre) {
      queryFilters.genres = genre;
    }

    const booksPerPageNumber = 10;
    const booksToSkipNumber = (Number(pageNumber) - 1) * booksPerPageNumber;

    const booksTotal = await this.bookModel.countDocuments(queryFilters);
    const booksReadTotal = await this.bookModel
      .where({
        state: "read",
      })
      .countDocuments(queryFilters);

    const booksToReadTotal = booksTotal - booksReadTotal;

    const books = await this.bookModel
      .find(queryFilters)
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

  public getBookById = async (
    req: BookDataRequest,
    res: BookResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { bookId } = req.params;

    const book = await this.bookModel.findById(bookId).exec();

    if (!book) {
      next(error404BookNotFound);

      return;
    }

    res.status(statusCodes.OK).json({ book: book });
  };

  public getBookStats = async (
    _req: Request,
    res: BookStatsResponse,
    next: NextFunction,
  ): Promise<void> => {
    const readBooksTotal = await this.bookModel
      .where({
        state: "read",
      })
      .countDocuments();

    if (readBooksTotal === 0) {
      next(error404ReadBooksNotFound);

      return;
    }

    const bookStatsDto: BookStatsMongoResponse = await this.bookModel.aggregate(
      [
        {
          $facet: {
            pages: [
              {
                $group: {
                  _id: "pages",
                  total: { $sum: "$pages" },
                },
              },
            ],
            read: [
              {
                $match: { state: "read" },
              },
              { $count: "total" },
            ],
            authors: [
              {
                $group: {
                  _id: "$author",
                },
              },
              { $count: "total" },
            ],
            genreStats: [
              { $unwind: "$genres" },
              { $group: { _id: "$genres", totals: { $sum: 1 } } },
              { $sort: { totals: -1 } },
            ],
            yearStats: [
              { $unwind: "$readDates.readYear" },
              {
                $group: {
                  _id: "$readDates.readYear",
                  booksTotal: { $sum: 1 },
                  pagesTotal: { $sum: "$pages" },
                },
              },
              { $sort: { _id: -1 } },
            ],
            yearAuthorStats: [
              { $unwind: "$readDates.readYear" },
              {
                $group: {
                  _id: { year: "$readDates.readYear", author: "$author" },
                },
              },
              {
                $group: {
                  _id: "$_id.year",
                  totals: { $sum: 1 },
                },
              },
              { $sort: { _id: -1 } },
            ],
          },
        },
      ],
    );

    const bookStats = transformBookStatsMongoResponseToBookStats(bookStatsDto);

    res.status(200).json(bookStats);
  };

  public markAsRead = async (
    req: BookDataRequest,
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
    req: BookDataRequest,
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
    req: BookDataRequest,
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
      delete book.userRating;
      delete book.readDates;
    }

    const addedBook = await this.bookModel.insertOne(book);

    res.status(statusCodes.CREATED).json({ book: addedBook });
  };

  public deleteBook = async (
    req: BookDataRequest,
    res: BookResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { bookId } = req.params;

    const deletedBook = await this.bookModel
      .findOneAndDelete({ _id: bookId })
      .exec();

    if (!deletedBook) {
      next(error404BookNotFound);

      return;
    }

    res.status(statusCodes.OK).json({ book: deletedBook });
  };

  public modifyBook = async (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ): Promise<void> => {
    const { book } = req.body;
    const { bookId } = req.params;

    const databaseBook = await this.bookModel.findById(bookId).exec();

    if (!databaseBook) {
      next(error404BookNotFound);

      return;
    }

    if (book.state === "to read") {
      delete book.userRating;
      delete book.readDates;
    }

    const modifiedBook = await this.bookModel.findOneAndReplace(
      { _id: bookId },
      book,
      { returnOriginal: false },
    );

    res.status(statusCodes.OK).json({ book: modifiedBook! });
  };

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
}

export default BookController;
