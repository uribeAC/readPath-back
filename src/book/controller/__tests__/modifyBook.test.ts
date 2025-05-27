import { Model } from "mongoose";
import { NextFunction } from "express";
import {
  akiraVol1,
  dragonBall,
  dragonBallDataModified,
  dragonBallVol1ToRead,
} from "../../fixtures/fixtures.js";
import { BookRequest, BookResponse } from "../types.js";
import { BookStructure } from "../../types.js";
import BookController from "../BookController.js";
import statusCodes from "../../../globals/statusCodes.js";
import { error404BookNotFound } from "../../../server/ServerError/data.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the modifyBook method of BookController", () => {
  const res: Pick<BookResponse, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a request with Dragon Ball Vol. 1 book id and the modified book", () => {
    const req: Pick<BookRequest, "params" | "body"> = {
      params: { bookId: dragonBallVol1ToRead._id },
      body: { book: dragonBall },
    };

    const bookModel: Pick<
      Model<BookStructure>,
      "findById" | "findOneAndReplace"
    > = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(dragonBallVol1ToRead),
      }),
      findOneAndReplace: jest.fn().mockResolvedValue(dragonBallDataModified),
    };

    test("Then it should call the response's method status with 200", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.modifyBook(
        req as BookRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(statusCodes.OK);
    });

    test("Then it should call the response's method json with Dragon Ball, Vol. 12", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.modifyBook(
        req as BookRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(res.json).toHaveBeenCalledWith({ book: dragonBallDataModified });
    });
  });

  describe("When it receives a request with Slam Dunk Vol. 1 book id that is not in the database and the modified book", () => {
    const req: Pick<BookRequest, "params" | "body"> = {
      params: { bookId: "slamdunk12slamdunk12DUNK" },
      body: { book: akiraVol1 },
    };

    const bookModel: Pick<
      Model<BookStructure>,
      "findById" | "findOneAndReplace"
    > = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findOneAndReplace: jest.fn().mockResolvedValue(null),
    };

    test("Then it should call the received next method with 404 'Book not found' error", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.modifyBook(
        req as BookRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error404BookNotFound);
    });
  });
});
