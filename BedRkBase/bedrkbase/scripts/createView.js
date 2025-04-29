const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
 
const connectionString = process.env.DATABASE_URL;
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});
 
client.connect()
  .then(() => {
    console.log("Connected to the database");
    return client.query("CREATE OR REPLACE VIEW public.tables AS SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name ASC;");
  })
  .then(() => {
    console.log("View 'public.tables' created successfully.");
    return client.end();
  })
  .catch((err) => {
    console.error("Error creating view:", err);
    client.end();
  });
