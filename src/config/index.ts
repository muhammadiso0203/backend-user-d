import * as dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: Number(process.env.PORT),
  DB_URL: String(process.env.DB_URL),
};
