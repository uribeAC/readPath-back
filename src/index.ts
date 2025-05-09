import "dotenv/config";
import startServer from "./server/startServer.js";
import connectToDatabase from "./database/connectToDatabase.js";

const port = process.env.PORT ?? 4000;

const connectionString = process.env.DATABASE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Error: Missing database connection string");
}

await connectToDatabase(connectionString);

startServer(Number(port));
