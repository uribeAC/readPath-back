import { Model } from "mongoose";
import { NextFunction } from "express";
import { narutoVol1 } from "../../fixtures/fixtures.js";
import { BookStructure } from "../../types.js";
import { BookDataRequest, BookResponse } from "../types.js";
import BookController from "../BookController.js";
import statusCodes from "../../../globals/statusCodes.js";
import { error404BookNotFound } from "../../../server/ServerError/data.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the deleteBook method of BookController", () => {
  const res: Pick<BookResponse, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a request with Naruto Vol. 1 book id that is already in the database", () => {
    const req: Pick<BookDataRequest, "params"> = {
      params: { bookId: narutoVol1._id },
    };

    const bookModel: Pick<Model<BookStructure>, "findOneAndDelete"> = {
      findOneAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(narutoVol1),
      }),
    };

    test("Then it should call the received response's method status with 200", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.deleteBook(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(statusCodes.OK);
    });

    test("Then it should call the response's method json with Naruto Vol. 1 book", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.deleteBook(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(res.json).toHaveBeenCalledWith({
        book: expect.objectContaining(narutoVol1),
      });
    });
  });

  describe("When it receives a request with Slam Dunk Vol. 1 book id that is not in the database", () => {
    const req: Pick<BookDataRequest, "params"> = {
      params: { bookId: "slamdunk12slamdunk12DUNK" },
    };

    const bookModel: Pick<Model<BookStructure>, "findOneAndDelete"> = {
      findOneAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    };

    test("Then it should call the received next method with 404 'Book not found' error", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.deleteBook(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error404BookNotFound);
    });
  });
});
