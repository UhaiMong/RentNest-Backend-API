import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
const port = env.port;
const envMode = env.node_env;
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

if (envMode === "development") {
  app.listen(port, () => {
    console.log(`http://localhost:${port}/api`);
  });
}
