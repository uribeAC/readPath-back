import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase.js";
import app from "../../../server/app.js";
import Book from "../../model/Book.js";
import {
  dragonBallDataModified,
  dragonBallDataRead,
} from "../../fixtures/fixtures.js";
import statusCodes from "../../../globals/statusCodes.js";
import { BookBodyResponse } from "../../controller/types.js";
import { ResponseBodyError } from "../../types.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const mongoDbConnectionString = server.getUri();

  await connectToDatabase(mongoDbConnectionString);
});

afterAll(async () => {
  mongoose.disconnect();
  await server.stop();
});

describe("Given the PUT /:bookId endpoint", () => {
  describe("When it receives a request with bookId of Dragon Ball Vol. 1 and the book modified", () => {
    test("Then it should respond with a 200 status code and Dragon Ball Vol. 12 book", async () => {
      const expectedTitle = "Dragon Ball, Vol. 12";

      const book = await Book.create(dragonBallDataRead);

      const dragonBallId = book._id;

      const response = await request(app)
        .put(`/books/${dragonBallId}`)
        .send({ book: dragonBallDataModified })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      const body = response.body as BookBodyResponse;

      expect(response.status).toBe(statusCodes.OK);
      expect(body.book).toMatchObject({ title: expectedTitle });
    });
  });

  describe("When it receives a request with a book id that it's not in the database", () => {
    test("Then it should respond with a 404 status code and a 'Book not found' error", async () => {
      const response = await request(app).delete(
        `/books/AAAAAAAAAAAAAAAAAAAAAAAA`,
      );

      const body = response.body as ResponseBodyError;

      expect(response.status).toBe(statusCodes.NOT_FOUND);
      expect(body.error).toBe("Book not found");
    });
  });
});
