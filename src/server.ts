import app from "./app";
import { env } from "./config/env";

const PORT = env.port;

const main = () => {
  app.listen(PORT, () => {
    console.log(`RentNest API is running on: ${PORT}`);
  });
};
main();
