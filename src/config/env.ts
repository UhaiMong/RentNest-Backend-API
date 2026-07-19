import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL || "",
  app_url: process.env.APP_URL || "",
  node_env: process.env.NODE_ENV || "development",
  jwt_secret: process.env.JWT_SECRET || "",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10),
  strip_secret_key: process.env.STRIPE_SECRET_KEY || "",
  strip_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || "",
};
