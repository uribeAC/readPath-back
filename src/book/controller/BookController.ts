import { Model } from "mongoose";
import { BookStructure } from "../types.js";
import { BookControllerStructure, BookRequest, BookResponse } from "./types.js";
import statusCodes from "../../globals/statusCodes.js";

class BookController implements BookControllerStructure {
  constructor(private bookModel: Model<BookStructure>) {}

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
}

export default BookController;
