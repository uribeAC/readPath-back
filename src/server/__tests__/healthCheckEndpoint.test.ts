import request from "supertest";
import app from "../app.js";
import statusCodes from "../../globals/statusCodes.js";
import { responseBodyMessage } from "../types.js";

describe("Given a GET / endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status code and a 'pong 🏓' message", async () => {
      const expectedStatus = statusCodes.OK;
      const expectedMessage = "pong 🏓";

      const response = await request(app).get("/");

      const body = response.body as responseBodyMessage;

      expect(response.status).toBe(expectedStatus);
      expect(body.message).toBe(expectedMessage);
    });
  });
});
