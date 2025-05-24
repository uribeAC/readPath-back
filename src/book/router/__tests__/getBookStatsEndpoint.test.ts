import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectToDatabase from "../../../database/connectToDatabase.js";
import app from "../../../server/app.js";
import Book from "../../model/Book.js";
import {
  attackOnTitanFinalVolume,
  narutoFinalVolume,
} from "../../fixtures/fixtures.js";
import { BookStats, ResponseBodyError } from "../../types.js";
import statusCodes from "../../../globals/statusCodes.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const mongoDbConnectionString = server.getUri();

  await connectToDatabase(mongoDbConnectionString);
});

beforeEach(async () => {
  await Book.deleteOne({ title: "Naruto, Vol. 72" });
  await Book.deleteOne({ title: "Attack on Titan, Vol. 34" });
});

afterAll(async () => {
  mongoose.disconnect();
  await server.stop();
});

describe("Given the GET /books/stats endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should return a 200 status code", async () => {
      await Book.create(narutoFinalVolume, attackOnTitanFinalVolume);

      const response = await request(app).get("/books/stats");

      expect(response.status).toBe(200);
    });

    test("Then it should return the manga stats, as a total of 2 books read, 2 authors and 464 pages", async () => {
      await Book.create(narutoFinalVolume, attackOnTitanFinalVolume);

      const response = await request(app).get("/books/stats");

      const body = response.body as BookStats;

      expect(body.totals).toMatchObject({
        read: 2,
        pages: 464,
        authors: 2,
      });
    });
  });

  describe("When it receives a request but there is 0 books read", () => {
    test("Then it should return a 404 'Read books not found' error", async () => {
      const response = await request(app).get("/books/stats");

      const body = response.body as ResponseBodyError;

      expect(response.status).toBe(statusCodes.NOT_FOUND);
      expect(body.error).toBe("Read books not found");
    });
  });
});
