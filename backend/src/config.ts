import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const { DB_URI } = process.env;
const { JWT_SECRET } = process.env;

const { CLOUD_NAME } = process.env;
const { CLOUD_URL } = process.env;
const { CLOUD_FOLDER } = process.env;
const { CLOUD_API_KEY } = process.env;
const { CLOUD_API_SECRET } = process.env;

export default {
  DB_URI,
  JWT_SECRET,
  CLOUD_NAME,
  CLOUD_URL,
  CLOUD_FOLDER,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
};
