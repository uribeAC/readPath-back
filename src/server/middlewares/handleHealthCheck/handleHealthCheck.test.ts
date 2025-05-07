import { Request, Response } from "express";
import handleHealthCheck from "./handleHealthCheck.js";

describe("Chiven the handleHealthCheck middleware", () => {
  describe("When it receives a response", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Pick<Response, "status" | "json">;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("Then it should call the received response's method status with 200", () => {
      const expectedStatus = 200;

      handleHealthCheck(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the received response's method json with a 'pong 🏓' message", () => {
      const expectedMessage = "pong 🏓";

      handleHealthCheck(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
});
