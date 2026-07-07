import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const PORT = env.port;

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Databse connected successfully.");
    app.listen(PORT, () => {
      console.log(`RentNest API is running on: ${PORT}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error when running the server");
    process.exit(1);
  }
};
main();
