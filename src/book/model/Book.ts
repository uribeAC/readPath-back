import { model, Schema } from "mongoose";
import { BookStructure } from "../types.js";

const RatingValues = [0, 1, 2, 3, 4, 5];

const bookSchema = new Schema<BookStructure>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    saga: {
      name: {
        type: String,
      },
      bookNumber: {
        type: Number,
      },
    },
    description: {
      type: String,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    firstPublished: {
      type: Date,
      required: true,
    },
    state: {
      type: String,
      enum: ["read", "to read"],
      default: "to read",
      required: true,
    },
    yourRating: {
      type: Number,
      enum: RatingValues,
    },
    readDates: {
      dateStarted: {
        type: Date,
      },
      dateFinished: {
        type: Date,
      },
      readYear: {
        type: Number,
      },
    },
    coverImageUrlSmall: {
      type: String,
      required: true,
    },
    coverImageUrlBig: {
      type: String,
      required: true,
    },
    imageAlt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Book = model("Book", bookSchema, "books");

export default Book;
