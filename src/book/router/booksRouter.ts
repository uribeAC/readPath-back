import { Router } from "express";
import BookController from "../controller/BookController.js";
import Book from "../model/Book.js";
import isValidId from "../../server/middlewares/isValidId/isValidId.js";

const booksRouter = Router();

const bookController = new BookController(Book);

booksRouter.get("/", bookController.getBooks);
booksRouter.get("/:bookId", isValidId, bookController.getBookById);
booksRouter.patch(
  "/mark-as-read/:bookId",
  isValidId,
  bookController.markAsRead,
);
booksRouter.patch(
  "/mark-as-toread/:bookId",
  isValidId,
  bookController.markAsToRead,
);
booksRouter.post("/", bookController.addBook);
booksRouter.delete("/:bookId", isValidId, bookController.deleteBook);

export default booksRouter;
