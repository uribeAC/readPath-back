import { NextFunction, Request, Response } from "express";
import {
  BookData,
  BookDataWithId,
  BookStats,
  BookStructure,
} from "../types.js";

export interface BookControllerStructure {
  getBooks: (req: BookDataRequest, res: BooksResponse) => Promise<void>;
  getBookById: (
    req: BookDataRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  markAsRead: (
    req: BookDataRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  markAsToRead: (
    req: BookDataRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  addBook: (
    req: BookDataRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  deleteBook: (
    req: BookDataRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  modifyBook: (
    req: BookRequest,
    res: BookResponse,
    next: NextFunction,
  ) => Promise<void>;
  getBookStats: (
    req: Request,
    res: BookStatsResponse,
    next: NextFunction,
  ) => Promise<void>;
}

export type BookDataRequest = Request<
  BookParams,
  Record<string, unknown>,
  BookDataBody,
  BookQuery
>;

export type BookRequest = Request<
  BookParams,
  Record<string, unknown>,
  BookBody,
  BookQuery
>;

export type BookQuery = {
  page: string;
  state: string;
  genre: string;
};

export type QueryFilters = { state?: string; genres?: string };

export type BookParams = {
  bookId: string;
};

export type BookDataBody = {
  book: BookData;
};

export type BookBody = {
  book: BookDataWithId;
};

export type BooksResponse = Response<BooksBodyResponse>;

export type BookResponse = Response<BookBodyResponse>;

export type BookStatsResponse = Response<BookStats>;

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

export type BookStatsMongoResponse = {
  pages: StatsTotals;
  read: StatsTotals;
  authors: StatsTotals;
  genreStats: { _id: string; totals: number }[];
  yearStats: { _id: number; booksTotal: number; pagesTotal: number }[];
  yearAuthorStats: { _id: number; totals: number }[];
}[];

type StatsTotals = { total: number }[];
