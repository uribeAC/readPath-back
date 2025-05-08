import { Router } from "express";
import BookController from "../controller/BookController.js";
import Book from "../model/Book.js";

const booksRouter = Router();

const bookController = new BookController(Book);

booksRouter.get("/", bookController.getBooks);

export default booksRouter;
