import { Model } from "mongoose";
import { NextFunction } from "express";
import {
  dragonBallVol1Read,
  dragonBallVol1ToRead,
} from "../../fixtures/fixtures.js";
import { BookStructure } from "../../types.js";
import { BookDataRequest, BookResponse } from "../types.js";
import BookController from "../BookController.js";
import statusCodes from "../../../globals/statusCodes.js";
import {
  error404BookNotFound,
  error409BookToRead,
} from "../../../server/ServerError/data.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the markAsToRead method of BookController", () => {
  const res: Pick<BookResponse, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a request with Dragon Ball, Vol. 1 book id and it's marked as 'Read'", () => {
    const req: Pick<BookDataRequest, "params"> = {
      params: { bookId: dragonBallVol1Read._id },
    };

    const bookModel: Pick<
      Model<BookStructure>,
      "findById" | "findByIdAndUpdate"
    > = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(dragonBallVol1Read),
      }),
      findByIdAndUpdate: jest.fn().mockResolvedValue(dragonBallVol1ToRead),
    };

    test("Then it should call the response's method status with 200", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.markAsToRead(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(statusCodes.OK);
    });

    test("Then it should call the response's method json with Dragon Ball, Vol. 1 book marked as 'To read'", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.markAsToRead(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(res.json).toHaveBeenCalledWith({ book: dragonBallVol1ToRead });
    });
  });

  describe("When it receives a request with Dragon Ball Vol.1 book id and it's marked as 'To read'", () => {
    test("Then it should call the received next method with 409 'Book is already marked as To read' error", async () => {
      const req: Pick<BookDataRequest, "params"> = {
        params: { bookId: dragonBallVol1ToRead._id },
      };

      const bookModel: Pick<
        Model<BookStructure>,
        "findById" | "findByIdAndUpdate"
      > = {
        findById: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(dragonBallVol1ToRead),
        }),
        findByIdAndUpdate: jest.fn().mockResolvedValue(dragonBallVol1ToRead),
      };

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.markAsToRead(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error409BookToRead);
    });
  });

  describe("When it receives a request with Akira Vol.1 book id that is not in the database", () => {
    test("Then it should call the received next method with 404 'Book not found' error", async () => {
      const req: Pick<BookDataRequest, "params"> = {
        params: { bookId: "Akira-vol.1" },
      };

      const bookModel: Pick<
        Model<BookStructure>,
        "findById" | "findByIdAndUpdate"
      > = {
        findById: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
        findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      };

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.markAsToRead(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error404BookNotFound);
    });
  });
});
