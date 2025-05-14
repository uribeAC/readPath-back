import "dotenv/config";
import express from "express";
import morgan from "morgan";
import handleHealthCheck from "./middlewares/handleHealthCheck/handleHealthCheck.js";
import handleErrors from "./middlewares/handleErrors/handleErrors.js";
import handleEndpointNotFound from "./middlewares/handleEndpointNotFound/handleEndpointNotFound.js";
import booksRouter from "../book/router/booksRouter.js";
import handleCors from "./middlewares/handleCors/handleCors.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(handleCors);

app.use(express.json());

app.get("/", handleHealthCheck);

app.use("/books", booksRouter);

app.use(handleEndpointNotFound);

app.use(handleErrors);

export default app;
