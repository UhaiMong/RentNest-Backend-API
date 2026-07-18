import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response, Application } from "express";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.route";
import categoryRoutes from "./modules/categories/category.route";
import propertyRoutes from "./modules/properties/property.route";
import landLordPropertyRoutes from "./modules/properties/landloard-property.route";
import rentalRoutes from "./modules/rentals/rental.route";
import landlordRentalRequestRoutes from "./modules/rentals/landlord-rental.route";
import paymentRoutes from "./modules/payments/payment.route";
import reviewRoutes from "./modules/reviews/review.routes";
import adminRoutes from "./modules/admin/admin.routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";
const app: Application = express();

app.use(
  cors({
    origin: env.app_url,
    credentials: true,
  }),
);

// stripe webhook route
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

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
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/landlord/properties", landLordPropertyRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/landlord/requests", landlordRentalRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// global error handler
app.use(notFound);
app.use(errorHandler);

export default app;
