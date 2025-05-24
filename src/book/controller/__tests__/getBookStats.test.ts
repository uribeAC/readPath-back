import { NextFunction, Request } from "express";
import { Model } from "mongoose";
import { BookStatsResponse } from "../types.js";
import { BookStructure } from "../../types.js";
import BookController from "../BookController.js";
import statusCodes from "../../../globals/statusCodes.js";
import { mangaStatsDto } from "../../fixtures/fixturesDto.js";
import { mangaStats } from "../../fixtures/fixtures.js";
import { error404ReadBooksNotFound } from "../../../server/ServerError/data.js";

describe("Given the getBookStats method of BookController", () => {
  const res: Pick<BookStatsResponse, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a response", () => {
    const bookModel: Pick<Model<BookStructure>, "aggregate" | "where"> = {
      where: jest.fn().mockReturnValue({
        countDocuments: jest.fn().mockResolvedValue(2),
      }),
      aggregate: jest.fn().mockResolvedValue(mangaStatsDto),
    };

    test("Then it should call the response's method status with 200", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBookStats(
        {} as Request,
        res as BookStatsResponse,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(statusCodes.OK);
    });

    test("Then it should call the response's method json with manga stats", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBookStats(
        {} as Request,
        res as BookStatsResponse,
        next as NextFunction,
      );

      expect(res.json).toHaveBeenCalledWith(mangaStats);
    });
  });

  describe("When it receives a response but there is 0 read books", () => {
    test("Then it should call the received next method with 404 'Read books not found' error", async () => {
      const bookModel: Pick<Model<BookStructure>, "aggregate" | "where"> = {
        where: jest.fn().mockReturnValue({
          countDocuments: jest.fn().mockResolvedValue(0),
        }),
        aggregate: jest.fn().mockResolvedValue(null),
      };

      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBookStats(
        {} as Request,
        res as BookStatsResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error404ReadBooksNotFound);
    });
  });
});
