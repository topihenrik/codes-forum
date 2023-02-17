import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const { DB_URI } = process.env;
const { JWT_SECRET } = process.env;

export default { DB_URI, JWT_SECRET };
