import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import Book from "../../model/Book.js";
import connectToDatabase from "../../../database/connectToDatabase.js";
import {
  attackOnTitanFinalVolume,
  narutoFinalVolume,
} from "../../fixtures/fixtures.js";
import app from "../../../server/app.js";
import { BooksBodyResponse } from "../../controller/types.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const mongoDbConnectionString = server.getUri();

  await connectToDatabase(mongoDbConnectionString);
});

beforeEach(async () => {
  await Book.deleteMany({ title: "Naruto, Vol. 72" });
  await Book.deleteOne({ title: "Attack on Titan, Vol. 34" });
});

afterAll(async () => {
  mongoose.disconnect();
  await server.stop();
});

describe("Given the GET /books endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should return a 200 status code with Naruto, Vol. 72 and Attack on Titan, Vol. 34 books and a total of 2 books, 2 reads and 0 to read", async () => {
      await Book.create(narutoFinalVolume, attackOnTitanFinalVolume);

      const response = await request(app).get("/books");

      expect(response.status).toBe(200);
    });

    test("Then it should return Naruto, Vol. 72 and Attack on Titan, Vol. 34 books", async () => {
      await Book.create(narutoFinalVolume, attackOnTitanFinalVolume);

      const response = await request(app).get("/books");

      const body = response.body as BooksBodyResponse;

      expect(body.books).toContainEqual(
        expect.objectContaining({ title: "Naruto, Vol. 72" }),
      );
      expect(body.books).toContainEqual(
        expect.objectContaining({ title: "Attack on Titan, Vol. 34" }),
      );
    });

    test("Then it should return a total of 2 books with 2 reads and 0 to read", async () => {
      await Book.create(narutoFinalVolume, attackOnTitanFinalVolume);

      const response = await request(app).get("/books");

      const body = response.body as BooksBodyResponse;

      expect(body.totals.books).toBe(2);
      expect(body.totals.booksRead).toBe(2);
      expect(body.totals.booksToRead).toBe(0);
    });
  });
});
