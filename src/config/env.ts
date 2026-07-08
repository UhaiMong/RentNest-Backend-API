import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL as string,
  app_url: process.env.APP_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10),
  //   strip_secret_key: process.env.STRIPE_SECRET_KEY,
};
