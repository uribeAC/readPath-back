import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase.js";
import app from "../../../server/app.js";
import Book from "../../model/Book.js";
import { BookBodyResponse } from "../../controller/types.js";
import statusCodes from "../../../globals/statusCodes.js";
import {
  dragonBallDataRead,
  dragonBallDataToRead,
} from "../../fixtures/fixtures.js";
import { ResponseBodyError } from "../../../server/types.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const mongoDbConnectionString = server.getUri();

  await connectToDatabase(mongoDbConnectionString);
});

beforeEach(async () => {
  await Book.deleteOne({ title: "Dragon Ball, Vol. 1" });
});

afterAll(async () => {
  mongoose.disconnect();
  await server.stop();
});

describe("Given the PATCH /books/mark-as-toread/:bookId endpoint", () => {
  describe("When it receives a request with bookId of Dragon Ball Vol. 1 as read", () => {
    test("Then it should respond with a 200 status code and Dragon Ball Vol. 1 book as to read", async () => {
      const expectedTitle = "Dragon Ball, Vol. 1";

      const book = await Book.create(dragonBallDataRead);

      expect(book.state).toBe("read");

      const dragonBallId = book._id;

      const response = await request(app).patch(
        `/books/mark-as-toread/${dragonBallId}`,
      );

      const body = response.body as BookBodyResponse;

      expect(response.status).toBe(statusCodes.OK);

      expect(body.book.title).toBe(expectedTitle);
      expect(body.book.state).toBe("to read");
    });
  });

  describe("When it receives a request with bookId of Dragon Ball Vol. 1 as to read", () => {
    test("Then it should respond with a 409 Book is already marked as to read error", async () => {
      const expectedError = "Book is already marked as to read";

      const book = await Book.create(dragonBallDataToRead);

      expect(book.state).toBe("to read");

      const dragonBallId = book._id;

      const response = await request(app).patch(
        `/books/mark-as-toread/${dragonBallId}`,
      );

      const body = response.body as ResponseBodyError;

      expect(response.status).toBe(statusCodes.CONFLICT);
      expect(body).toStrictEqual({ error: expectedError });
    });
  });

  describe("When it receives a request with bookId of Akira Vol.1 that is not in the database", () => {
    test("Then it should respond with a 404 Book not found error", async () => {
      const expectedError = "Book not found";

      const akiraId = "012345678901234567891234";

      const response = await request(app).patch(
        `/books/mark-as-read/${akiraId}`,
      );

      const body = response.body as ResponseBodyError;

      expect(response.status).toBe(statusCodes.NOT_FOUND);
      expect(body).toStrictEqual({ error: expectedError });
    });
  });
});
