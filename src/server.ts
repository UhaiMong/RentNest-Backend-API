import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    console.log("Databse connected successfully.");
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error when running the server");
    process.exit(1);
  }
}
main();
if (env.node_env !== "production") {
  app.listen(env?.port || 5000, () => {
    console.log(`RentNest API is running on: ${env?.port}`);
  });
}

export default app;
