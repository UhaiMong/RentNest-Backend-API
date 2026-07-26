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
