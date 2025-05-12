import { NextFunction, Request, Response } from "express";
import { BookStructure } from "../types.js";

export interface BookControllerStructure {
  getBooks: (req: BookRequest, res: BookResponse) => Promise<void>;
  markAsRead: (
    req: BookRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  markAsToRead: (
    req: BookRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

export type BookRequest = Request<
  BookParams,
  Record<string, unknown>,
  Record<string, unknown>,
  BookQuery
>;

export type BookQuery = {
  page: string;
};

export type BookParams = {
  bookId: string;
};

export type BookResponse = Response<BooksBodyResponse>;

export type BooksBodyResponse = {
  books: BookStructure[];
  totals: {
    books: number;
    booksRead: number;
    booksToRead: number;
  };
};

export type BookBodyResponse = {
  book: BookStructure;
};
