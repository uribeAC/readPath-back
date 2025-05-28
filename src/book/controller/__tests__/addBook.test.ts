import { Model } from "mongoose";
import {
  dragonBallDataToRead,
  dragonBallVol1Read,
  dragonBallVol1ToRead,
} from "../../fixtures/fixtures.js";
import { BookStructure } from "../../types.js";
import { BookDataRequest, BookResponse } from "../types.js";
import BookController from "../BookController.js";
import { NextFunction } from "express";
import statusCodes from "../../../globals/statusCodes.js";
import { error409BookExists } from "../../../server/ServerError/data.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the addBook method of BookController", () => {
  const res: Pick<BookResponse, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  const req: Pick<BookDataRequest, "body"> = {
    body: { book: dragonBallDataToRead },
  };
  describe("When it receives Dragon Ball book data", () => {
    const bookModel: Pick<Model<BookStructure>, "findOne" | "insertOne"> = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      insertOne: jest.fn().mockResolvedValue(dragonBallVol1ToRead),
    };

    const bookController = new BookController(
      bookModel as Model<BookStructure>,
    );

    test("Then it should call the response's method status with 201", async () => {
      await bookController.addBook(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(statusCodes.CREATED);
    });

    test("Then it should call the response's method json with Dragon Ball book", async () => {
      await bookController.addBook(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(res.json).toHaveBeenCalledWith({ book: dragonBallVol1ToRead });
    });
  });

  describe("When it receives the existent Dragon Ball book data", () => {
    test("Then it should call the response's method status with a 409 and a 'Book already exists' message", async () => {
      const bookModel: Pick<Model<BookStructure>, "findOne"> = {
        findOne: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(dragonBallVol1Read),
        }),
      };

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.addBook(
        req as BookDataRequest,
        res as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error409BookExists);
    });
  });
});
