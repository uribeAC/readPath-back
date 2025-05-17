import { NextFunction, Request, Response } from "express";
import { BookData, BookStructure } from "../types.js";

export interface BookControllerStructure {
  getBooks: (req: BookRequest, res: BooksResponse) => Promise<void>;
  getBookById: (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  markAsRead: (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  markAsToRead: (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  addBook: (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  deleteBook: (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
}

export type BookRequest = Request<
  BookParams,
  Record<string, unknown>,
  BookBody,
  BookQuery
>;

export type BookQuery = {
  page: string;
};

export type BookParams = {
  bookId: string;
};

export type BookBody = {
  book: BookData;
};

export type BooksResponse = Response<BooksBodyResponse>;

export type BookResponse = Response<BookBodyResponse>;

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
