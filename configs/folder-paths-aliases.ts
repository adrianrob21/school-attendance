import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const aliases = {
  // UI
  Components: path.resolve(__dirname, "../src/ui/components"),
  Assets: path.resolve(__dirname, "../src/ui/assets"),
  Navigator: path.resolve(__dirname, "../src/ui/navigator"),
  Pages: path.resolve(__dirname, "../src/ui/pages"),

  // Process
  ReduxStore: path.resolve(__dirname, "../src/process/redux-store"),
  Api: path.resolve(__dirname, "../src/process/api"),
  Constants: path.resolve(__dirname, "../src/process/constants"),
  Sagas: path.resolve(__dirname, "../src/process/sagas"),
  Locales: path.resolve(__dirname, "../src/process/locales"),
  Reducers: path.resolve(__dirname, "../src/process/reducers"),
  Endpoints: path.resolve(__dirname, "../src/process/endpoints"),
  ValidationSchemas: path.resolve(
    __dirname,
    "../src/process/validationSchemas",
  ),
  Hooks: path.resolve(__dirname, "../src/process/hooks"),
};
