import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectToDatabase from "../../../database/connectToDatabase.js";
import Book from "../../model/Book.js";
import app from "../../../server/app.js";
import { dragonBallDataRead } from "../../fixtures/fixtures.js";
import { BookBodyResponse } from "../../controller/types.js";
import statusCodes from "../../../globals/statusCodes.js";
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

describe("Given the POST /books endpoint", () => {
  describe("When it receives a request with Dragon Ball Vol. 1 book data", () => {
    test("Then it should respond with a 201 status code and Dragon Ball Vol.1 book", async () => {
      const expectedTitle = "Dragon Ball, Vol. 1";

      const response = await request(app)
        .post("/books")
        .send({ book: dragonBallDataRead })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      const body = response.body as BookBodyResponse;

      expect(response.status).toBe(statusCodes.CREATED);
      expect(body.book.title).toBe(expectedTitle);
    });

    describe("And the book is already in the database", () => {
      test("Then it should respon with a 409 status code and a 'Post already exists' error", async () => {
        await Book.create(dragonBallDataRead);

        const response = await request(app)
          .post("/books")
          .send({ book: dragonBallDataRead })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        const body = response.body as ResponseBodyError;

        expect(response.status).toBe(statusCodes.CONFLICT);
        expect(body.error).toBe("Book already exists");
      });
    });
  });
});
