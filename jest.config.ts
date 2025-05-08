import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const config: Config = {
  verbose: true,
  rootDir: "src",
  resolver: "ts-jest-resolver",
  coverageDirectory: "../coverage",
  collectCoverageFrom: [
    "**/*.ts",
    "!**/*.d.ts",
    "!index.ts",
    "!**/types.ts",
    "!server/startServer.ts",
    "!database/connectToDatabase.ts",
  ],
  ...createDefaultPreset(),
};

export default config;
