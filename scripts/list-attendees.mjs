import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read database URL from .env.local or .env
function getDbUrl() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const directMatch = content.match(/DIRECT_URL=["']?([^"'\n]+)["']?/);
      if (directMatch) return directMatch[1];
      const dbMatch = content.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
      if (dbMatch) return dbMatch[1];
    }
  }
  return null;
}

async function main() {
  const connectionString = getDbUrl();
  if (!connectionString) {
    console.error('Error: Could not find database connection string in .env or .env.local');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  try {
    await client.connect();

    // Find the latest Incept Episode II event
    const eventRes = await client.query(`
      SELECT id, title, "startDate", "startTime", price
      FROM "Event"
      WHERE title ILIKE '%Episode - I I%' OR title ILIKE '%Episode 2%' OR title ILIKE '%INCEPT%'
      ORDER BY "createdAt" DESC
      LIMIT 1;
    `);

    if (eventRes.rows.length === 0) {
      console.log('No matching event found.');
      return;
    }

    const event = eventRes.rows[0];

    // Fetch registered attendees for this event
    const attendeesRes = await client.query(`
      SELECT 
        name,
        email,
        phone,
        "ticketCode",
        status,
        "paymentMethod",
        "paymentTxnId",
        "createdAt"
      FROM "Registration"
      WHERE "eventId" = $1
      ORDER BY "createdAt" DESC;
    `, [event.id]);

    console.log(`\n======================================================`);
    console.log(` Attendees for: ${event.title} (Total: ${attendeesRes.rows.length})`);
    console.log(` Date: ${event.startDate} at ${event.startTime} | Price: ${event.price}`);
    console.log(`======================================================\n`);

    if (attendeesRes.rows.length === 0) {
      console.log('No attendees registered yet.');
    } else {
      console.table(attendeesRes.rows.map((r, idx) => ({
        '#': idx + 1,
        'Name': r.name,
        'Email': r.email,
        'Phone': r.phone || 'N/A',
        'Ticket Code': r.ticketCode,
        'Status': r.status,
        'Payment': r.paymentMethod || 'N/A',
        'Txn ID': r.paymentTxnId || 'N/A'
      })));
    }
  } catch (err) {
    console.error('Database query error:', err.message);
  } finally {
    await client.end().catch(() => {});
  }
}

main();
