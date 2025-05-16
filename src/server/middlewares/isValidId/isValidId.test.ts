import { NextFunction } from "express";
import { BookRequest, BookResponse } from "../../../book/controller/types.js";
import ServerError from "../../ServerError/ServerError.js";
import isValidId from "./isValidId.js";

describe("Given the isValidId middleware", () => {
  describe("When it receives a not valid Id and a next function", () => {
    test("Then it should call the next function with with 400, 'Id not valid' error", async () => {
      const error = new ServerError(400, "Id not valid");
      const req = {
        params: { bookId: "12345" },
      } as Pick<BookRequest, "params">;
      const next = jest.fn();

      await isValidId(
        req as BookRequest,
        {} as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a valid Id and a next function", () => {
    test("Then it should call the next function", async () => {
      const error = new ServerError(400, "Id not valid");
      const req = {
        params: { bookId: "123451234512345123451234" },
      } as Pick<BookRequest, "params">;
      const next = jest.fn();

      await isValidId(
        req as BookRequest,
        {} as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith();
      expect(next).not.toHaveBeenCalledWith(error);
    });
  });
});
