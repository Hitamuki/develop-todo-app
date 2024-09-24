import type { Config } from "jest";

// node_module内のESM形式のパッケージ
const esmPackages = ["@angular/*", "@testing-library/angular", "@ngrx/*"];

const config: Config = {
  preset: "jest-preset-angular",
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
};

export default config;
