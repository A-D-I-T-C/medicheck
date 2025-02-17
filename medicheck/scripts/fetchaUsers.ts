import { getUsers } from '../lib/db/queries';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { user } from '../lib/db/schema';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function fetchUsers() {
  try {
    const users = await getUsers();
    console.log('Users:', users);
  } catch (error) {
    console.error('Failed to fetch users from database:', error);
  } finally {
    await client.end();
  }
}

fetchUsers();