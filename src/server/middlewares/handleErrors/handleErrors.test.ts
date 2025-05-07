import { Request, Response } from "express";
import ServerError from "../../ServerError/ServerError.js";
import handleErrors from "./handleErrors.js";
import statusCodes from "../../../globals/statusCodes.js";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given the handleErrors middleware", () => {
  const res: Pick<Response, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a response and a 404 'Endpoint not found' error", () => {
    const error = new ServerError(statusCodes.NOT_FOUND, "Endpoint not found");

    test("Then it should call the response's method status with 404", () => {
      handleErrors(error, {} as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
    });

    test("Then it should call the response's method json with an 'Endpoint not found' error", () => {
      handleErrors(error, {} as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("When it receives a 'Can't read properties of undefined' error", () => {
    const error = new Error("Can't read properties of undefined");

    test("Then it should call the response's method status with 500", () => {
      handleErrors(error as ServerError, {} as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(
        statusCodes.INTERNAL_SERVER_ERROR,
      );
    });

    test("Then it should call the response's method json with an 'Internal server error' error", () => {
      handleErrors(error as ServerError, {} as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
