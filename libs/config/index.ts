import 'dotenv/config';

export const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  QUEUE_NAME: process.env.QUEUE_NAME,
  QUEUE_URL: process.env.QUEUE_URL,
  APN_MODE: process.env.APN_MODE,
  APN_KEY: process.env.APN_KEY,
  APN_KEY_ID: process.env.APN_KEY_ID,
  APN_TEAM_ID: process.env.APN_TEAM_ID,
  APN_APP_TOPIC: process.env.APN_APP_TOPIC,
};
