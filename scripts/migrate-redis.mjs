import { Redis } from "@upstash/redis";

const OLD_URL = "https://more-stork-42589.upstash.io";
const OLD_TOKEN = "AaZdAAIgcDFhOTIxODY4MmZiOTk0ZDg1OTEwNzhmNWY3NDI0OGZmNA";
const NEW_URL = "https://meowdis.enkutatashevents.workers.dev";
const NEW_TOKEN = "2047b34adb2c09b5e2cf9d7ec5845adaf2919d2d24ca12f9b5f3a66b2de8e956";

const oldRedis = new Redis({ url: OLD_URL, token: OLD_TOKEN });
const newRedis = new Redis({ url: NEW_URL, token: NEW_TOKEN });

const KEYS_TO_MIGRATE = [
  "data:events",
  "data:bookings",
  "data:contact-submissions",
  "data:site-content",
  "data:activities",
  "data:admin-settings",
  "data:venues",
];

async function migrate() {
  for (const key of KEYS_TO_MIGRATE) {
    try {
      const value = await oldRedis.get(key);
      if (value !== null) {
        await newRedis.set(key, value);
        console.log(`✓ Migrated ${key}`);
      } else {
        console.log(`- Skipped ${key} (no data)`);
      }
    } catch (err) {
      console.error(`✗ Failed ${key}:`, err.message);
    }
  }
  console.log("\nMigration complete!");
}

migrate().catch(console.error);
