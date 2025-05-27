import { NextFunction } from "express";
import {
  BookDataRequest,
  BookResponse,
} from "../../../book/controller/types.js";
import isValidId from "./isValidId.js";
import { error400NotValidId } from "../../ServerError/data.js";

describe("Given the isValidId middleware", () => {
  describe("When it receives a not valid Id and a next function", () => {
    test("Then it should call the next function with with 400, 'Id not valid' error", async () => {
      const req = {
        params: { bookId: "12345" },
      } as Pick<BookDataRequest, "params">;
      const next = jest.fn();

      await isValidId(
        req as BookDataRequest,
        {} as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error400NotValidId);
    });
  });

  describe("When it receives a valid Id and a next function", () => {
    test("Then it should call the next function", async () => {
      const req = {
        params: { bookId: "123451234512345123451234" },
      } as Pick<BookDataRequest, "params">;
      const next = jest.fn();

      await isValidId(
        req as BookDataRequest,
        {} as BookResponse,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith();
      expect(next).not.toHaveBeenCalledWith(error400NotValidId);
    });
  });
});
