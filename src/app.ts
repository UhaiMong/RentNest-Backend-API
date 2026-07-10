import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response, Application } from "express";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.route";
const app: Application = express();

app.use(
  cors({
    origin: env.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
export default app;
