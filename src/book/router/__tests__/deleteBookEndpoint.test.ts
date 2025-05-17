import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectToDatabase from "../../../database/connectToDatabase.js";
import Book from "../../model/Book.js";
import {
  attackOnTitanFinalVolume,
  narutoFinalVolume,
} from "../../fixtures/fixtures.js";
import app from "../../../server/app.js";
import { BookBodyResponse } from "../../controller/types.js";
import statusCodes from "../../../globals/statusCodes.js";
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

describe("Given the DELETE /:bookId endpoint", () => {
  describe("When it receives a request with bookId of Naruto Vol. 72", () => {
    test("Then it should respond with a 200 status code and Naruto Vol. 72 book", async () => {
      const expectedNarutoTitle = narutoFinalVolume.title;

      const books = await Book.create(
        narutoFinalVolume,
        attackOnTitanFinalVolume,
      );

      const narutoId = books.find(
        (book) => book.title === expectedNarutoTitle,
      )!._id;

      const response = await request(app).delete(`/books/${narutoId}`);

      const body = response.body as BookBodyResponse;

      expect(response.status).toBe(statusCodes.OK);
      expect(body.book).toMatchObject({ title: expectedNarutoTitle });
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
