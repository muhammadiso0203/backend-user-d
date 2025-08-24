import * as dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: Number(process.env.PORT),
  DB_URL: String(process.env.DB_URL),
  BASE_URL: String(process.env.BASE_URL),
  RESEND_API_KEY: String(process.env.RESEND_API_KEY),
  RESEND_FROM_EMAIL: String(process.env.RESEND_FROM_EMAIL),
  ACCESS_TOKEN_KEY: String(process.env.ACCESS_TOKEN_KEY),
  ACCESS_TOKEN_TIME: String(process.env.ACCESS_TOKEN_TIME),
  REFRESH_TOKEN_KEY: String(process.env.REFRESH_TOKEN_KEY),
  REFRESH_TOKEN_TIME: String(process.env.REFRESH_TOKEN_TIME),
};
