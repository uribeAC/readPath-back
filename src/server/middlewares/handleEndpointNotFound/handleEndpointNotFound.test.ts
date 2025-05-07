import { NextFunction, Request, Response } from "express";
import statusCodes from "../../../globals/statusCodes.js";
import ServerError from "../../ServerError/ServerError.js";
import handleEndpointNotFound from "./handleEndpointNotFound.js";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given the handleEndpointNotFound middleware", () => {
  describe("When it receives a next function", () => {
    const error = new ServerError(statusCodes.NOT_FOUND, "Endpoint not found");

    const next = jest.fn();

    test("Then it should call the next function with an error 'Endpoint not found'", () => {
      handleEndpointNotFound(
        {} as Request,
        {} as Response,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: error.message }),
      );
    });

    test("Then it should call the next function with a status code 404", () => {
      handleEndpointNotFound(
        {} as Request,
        {} as Response,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: error.statusCode }),
      );
    });
  });
});
