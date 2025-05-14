import { Router } from "express";
import BookController from "../controller/BookController.js";
import Book from "../model/Book.js";

const booksRouter = Router();

const bookController = new BookController(Book);

booksRouter.get("/", bookController.getBooks);

booksRouter.patch("/mark-as-read/:bookId", bookController.markAsRead);

booksRouter.patch("/mark-as-toread/:bookId", bookController.markAsToRead);

booksRouter.post("/", bookController.addBook);

export default booksRouter;
