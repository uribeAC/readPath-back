import { Request } from "express";
import { Model } from "mongoose";
import { BookStatsResponse } from "../types.js";
import { BookStructure } from "../../types.js";
import BookController from "../BookController.js";
import statusCodes from "../../../globals/statusCodes.js";
import { mangaStatsDto } from "../../fixtures/fixturesDto.js";
import { mangaStats } from "../../fixtures/fixtures.js";

describe("Given the getBookStats method of BookController", () => {
  const res: Pick<BookStatsResponse, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a response", () => {
    const bookModel: Pick<Model<BookStructure>, "aggregate"> = {
      aggregate: jest.fn().mockResolvedValue(mangaStatsDto),
    };

    test("Then it should call the response's method status with 200", async () => {
      const bookController = new BookController(
        bookModel as Model<BookStructure>,
      );

      await bookController.getBookStats(
        {} as Request,
        res as BookStatsResponse,
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
      );

      expect(res.json).toHaveBeenCalledWith(mangaStats);
    });
  });
});
