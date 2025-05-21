import { Model } from "mongoose";
import { BookStructure } from "../../types.js";
import { BookRequest, BooksResponse } from "../types.js";
import {
  bleachVol1,
  mangaFixtures as mangaFixturesOriginal,
  narutoVol1,
  onePieceVol1,
} from "../../fixtures/fixtures.js";
import BookController from "../BookController.js";
import statusCodes from "../../../globals/statusCodes.js";

let mangaFixtures = [...mangaFixturesOriginal];

beforeEach(() => {
  mangaFixtures = [...mangaFixturesOriginal];
  jest.clearAllMocks();
});

describe("Given the getBooks method of BookController", () => {
  const booksPerPageNumber = 10;

  const res: Pick<BooksResponse, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a response", () => {
    const req: Pick<BookRequest, "query"> = {
      query: { page: "", state: "", genre: "" },
    };

    const pageNumber = 1;
    const minBookPosition = (pageNumber - 1) * booksPerPageNumber;
    const maxBookPosition = minBookPosition + booksPerPageNumber;

    const bookModel: Pick<
      Model<BookStructure>,
      "find" | "countDocuments" | "where"
    > = {
      countDocuments: jest.fn().mockResolvedValue(mangaFixtures.length),
      where: jest.fn().mockReturnValue({
        countDocuments: jest
          .fn()
          .mockResolvedValue(
            mangaFixtures.filter((manga) => manga.state === "read").length,
          ),
      }),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest
                .fn()
                .mockResolvedValue(
                  mangaFixtures.slice(minBookPosition, maxBookPosition),
                ),
            }),
          }),
        }),
      }),
    };

    test("Then it should call the response's method status with 200", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBooks(req as BookRequest, res as BooksResponse);

      expect(res.status).toHaveBeenCalledWith(statusCodes.OK);
    });

    test("Then it should call the response's method json with 10 books", async () => {
      const expectedBooks = mangaFixtures.slice(
        minBookPosition,
        maxBookPosition,
      );

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBooks(req as BookRequest, res as BooksResponse);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          books: expectedBooks,
        }),
      );
    });

    test("Then it should call the response's method json with 12 as a total number of books", async () => {
      const expectedBooksTotal = 12;

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBooks(req as BookRequest, res as BooksResponse);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totals: expect.objectContaining({ books: expectedBooksTotal }),
        }),
      );
    });

    test("Then it should call the response's method json with 5 as total number of books to read", async () => {
      const expectedBooksToReadTotal = 5;

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBooks(req as BookRequest, res as BooksResponse);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totals: expect.objectContaining({
            booksToRead: expectedBooksToReadTotal,
          }),
        }),
      );
    });

    test("Then it should call the response's method json with 7 as total number of books read", async () => {
      const expectedBooksReadTotal = 7;

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBooks(req as BookRequest, res as BooksResponse);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totals: expect.objectContaining({
            booksRead: expectedBooksReadTotal,
          }),
        }),
      );
    });
  });

  describe("When it receives a request with page 2", () => {
    const pageNumber = 2;
    const minBookPosition = (pageNumber - 1) * booksPerPageNumber;
    const maxBookPosition = minBookPosition + booksPerPageNumber;

    const req: Pick<BookRequest, "query"> = {
      query: { page: pageNumber.toString(), state: "", genre: "" },
    };

    const bookModel: Pick<
      Model<BookStructure>,
      "find" | "countDocuments" | "where"
    > = {
      countDocuments: jest.fn().mockResolvedValue(mangaFixtures.length),
      where: jest.fn().mockReturnValue({
        countDocuments: jest
          .fn()
          .mockResolvedValue(
            mangaFixtures.filter((manga) => manga.state === "read").length,
          ),
      }),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest
                .fn()
                .mockResolvedValue(
                  mangaFixtures
                    .sort(
                      (bookA: BookStructure, bookB: BookStructure) =>
                        bookB.firstPublished.getTime() -
                        bookA.firstPublished.getTime(),
                    )
                    .slice(minBookPosition, maxBookPosition),
                ),
            }),
          }),
        }),
      }),
    };

    test("Then it should call the response's method json with books 11 and 12", async () => {
      const expectedBooks = mangaFixtures
        .sort(
          (bookA: BookStructure, bookB: BookStructure) =>
            bookB.firstPublished.getTime() - bookA.firstPublished.getTime(),
        )
        .slice(minBookPosition, maxBookPosition);

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBooks(req as BookRequest, res as BooksResponse);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          books: expectedBooks,
        }),
      );
    });
  });

  describe("When it receives a request with state: read and genre: shounen", () => {
    const pageNumber = 1;
    const minBookPosition = (pageNumber - 1) * booksPerPageNumber;
    const maxBookPosition = minBookPosition + booksPerPageNumber;

    const req: Pick<BookRequest, "query"> = {
      query: { page: pageNumber.toString(), state: "", genre: "" },
    };

    const bookModel: Pick<
      Model<BookStructure>,
      "find" | "countDocuments" | "where"
    > = {
      countDocuments: jest.fn().mockResolvedValue(mangaFixtures.length),
      where: jest.fn().mockReturnValue({
        countDocuments: jest
          .fn()
          .mockResolvedValue(
            mangaFixtures.filter((manga) => manga.state === "read").length,
          ),
      }),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(
                mangaFixtures
                  .sort(
                    (bookA: BookStructure, bookB: BookStructure) =>
                      bookB.firstPublished.getTime() -
                      bookA.firstPublished.getTime(),
                  )
                  .filter(
                    (manga) =>
                      manga.state === "read" &&
                      manga.genres.some((genre) => genre === "Shounen"),
                  )
                  .slice(minBookPosition, maxBookPosition),
              ),
            }),
          }),
        }),
      }),
    };

    test("Then it should call the response's method json with Naruto, One Piece and Bleach Vol's. 1", async () => {
      const expectedBooks = [bleachVol1, narutoVol1, onePieceVol1];

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBooks(req as BookRequest, res as BooksResponse);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          books: expectedBooks,
        }),
      );
    });
  });
});
