import express from "express";
import morgan from "morgan";
import handleHealthStatus from "./middlewares/handleHealthStatus/handleHealthStatus.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.get("/", handleHealthStatus);

export default app;
