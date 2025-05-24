import statusCodes from "../../globals/statusCodes.js";
import ServerError from "./ServerError.js";

export const error409BookExists = new ServerError(
  statusCodes.CONFLICT,
  "Book already exists",
);

export const error409BookRead = new ServerError(
  statusCodes.CONFLICT,
  "Book is already marked as read",
);

export const error409BookToRead = new ServerError(
  statusCodes.CONFLICT,
  "Book is already marked as to read",
);

export const error404BookNotFound = new ServerError(
  statusCodes.NOT_FOUND,
  "Book not found",
);

export const error404ReadBooksNotFound = new ServerError(
  statusCodes.NOT_FOUND,
  "Read books not found",
);

export const error500NotUpdate = new ServerError(
  statusCodes.INTERNAL_SERVER_ERROR,
  "Couldn't update book",
);

export const error400NotValidId = new ServerError(400, "Id not valid");
