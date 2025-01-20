import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken';
import pkg from "pg";
import * as AWS from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";



const { Pool } = pkg;
const { sign } = jsonwebtoken;

dotenv.config();

const PORT = process.env.PORT || 4000;
const JWT_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET: string | undefined = process.env.REFRESH_TOKEN_SECRET;

const pool = new Pool({
  user: process.env.DB_USER || "",
  host: process.env.DB_HOST || "",
  database: process.env.DB_NAME || "",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || '5432'),
});

const generate_access_token = (payload: any) => {
  if (!JWT_SECRET) throw new Error("Invalid Secret");

  const token = sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

const generate_refresh_token = (payload: any) => {
  if (!REFRESH_SECRET) throw new Error("Invalid Secret");

  const token = sign(payload, REFRESH_SECRET, { expiresIn: "3h" });
  return token;
};

const ses = new AWS.SES({
    apiVersion: '2010-12-01',
    region: process.env.REGION || '',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    },
});

const transporter = nodemailer.createTransport({
    SES: { ses, aws: AWS },
});

export {generate_refresh_token, generate_access_token, pool, transporter, PORT, REFRESH_SECRET, JWT_SECRET};
