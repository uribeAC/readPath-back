import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
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

describe("Given the GET /books/:bookId endpoint", () => {
  describe("When it receives a request with the book id of Naruto Vol. 72", () => {
    test("Then it should respond with a 200 status code and Naruto Vol. 72 book", async () => {
      const books = await Book.create(
        narutoFinalVolume,
        attackOnTitanFinalVolume,
      );

      const narutoBookId = books.find(
        (book) => book.title === narutoFinalVolume.title,
      )!._id;

      const response = await request(app).get(`/books/${narutoBookId}`);

      const { book } = response.body as BookBodyResponse;

      expect(response.status).toBe(statusCodes.OK);
      expect(book).toMatchObject({ title: narutoFinalVolume.title });
    });
  });

  describe("When it receives a request with a book Id that it's not in the database", () => {
    test("Then it should respond with a 404 status code and a 'Book not found' error", async () => {
      const response = await request(app).get(
        `/books/AAAAAAAAAAAAAAAAAAAAAAAA`,
      );

      const body = response.body as ResponseBodyError;

      expect(response.status).toBe(statusCodes.NOT_FOUND);
      expect(body.error).toBe("Book not found");
    });
  });
});
