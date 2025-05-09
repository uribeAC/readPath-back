import { Request, Response } from "express";
import { BookStructure } from "../types.js";

export interface BookControllerStructure {
  getBooks: (req: BookRequest, res: BookResponse) => Promise<void>;
}

export type BookRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  BookQuery
>;

export type BookQuery = {
  page: string;
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
