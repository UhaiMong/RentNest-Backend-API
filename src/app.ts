import express, { Request, Express, Response } from "express";
const app: Express = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("RentNest API is running...");
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: true,
    message: "RentNest API is running...",
    author: "Uhai Mong, Next Level Developer",
  });
});

// ALL API END POINT
// TODO:
export default app;
