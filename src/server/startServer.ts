import "dotenv/config";
import chalk from "chalk";
import createDebug from "debug";
import app from "./app.js";

const debug = createDebug("books:server");

const startServer = (port: number): void => {
  app.listen(port, () => {
    debug(
      chalk.blue("🚀💫 Server launched:") +
        chalk.green(` Listening on http://localhost:${port}`),
    );
  });
};

export default startServer;
