import request from "supertest";
import app from "../app.js";
import { ResponseBodyError } from "../types.js";
import statusCodes from "../../globals/statusCodes.js";

describe("Given a GET /Manga non existent endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should show a respons with 404 status code and an 'Endpoint not found' error", async () => {
      const expectedStatus = statusCodes.NOT_FOUND;
      const expectedErrorMessage = "Endpoint not found";

      const response = await request(app).get("/Manga");

      const body = response.body as ResponseBodyError;

      expect(response.status).toBe(expectedStatus);
      expect(body.error).toBe(expectedErrorMessage);
    });
  });
});
