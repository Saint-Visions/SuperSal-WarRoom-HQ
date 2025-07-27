import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await client.end();
  }
}

testConnection();