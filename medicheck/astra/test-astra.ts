import { DataAPIClient } from "@datastax/astra-db-ts";

// Initialize the client
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
if (!process.env.ASTRA_DB_API_ENDPOINT) {
  throw new Error('ASTRA_DB_API_ENDPOINT is not defined');
}
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);

(async () => {
  const colls = await db.listCollections();
  console.log('Connected to AstraDB:', colls);
})();