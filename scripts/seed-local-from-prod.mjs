import { Redis } from "@upstash/redis";

// Read real prod data (read-only) and copy into the LOCAL dev shim so the admin
// UI can be tested with realistic content. Prod is never written to.
const PROD_URL = "https://meowdis.enkutatashevents.workers.dev";
const PROD_TOKEN = "2047b34adb2c09b5e2cf9d7ec5845adaf2919d2d24ca12f9b5f3a66b2de8e956";

const LOCAL_URL = process.env.LOCAL_SHIM_URL || "http://127.0.0.1:8379";
const LOCAL_TOKEN = "local-dev-shim-token";

const prod = new Redis({ url: PROD_URL, token: PROD_TOKEN });

const KEYS = [
  "data:site-content",
  "data:events",
  "data:bookings",
  "data:contact-submissions",
  "data:activities",
  "data:venues",
  "data:admin-settings",
];

async function localRest(command) {
  const res = await fetch(LOCAL_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${LOCAL_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  return res.json();
}

for (const key of KEYS) {
  try {
    const value = await prod.get(key);
    if (value === null || value === undefined) {
      console.log(`- ${key}: not present in prod`);
      continue;
    }
    await localRest(["SET", key, JSON.stringify(value)]);
    const size = JSON.stringify(value).length;
    console.log(`✓ copied ${key} (${size} bytes)`);
  } catch (err) {
    console.error(`✗ ${key}: ${err.message}`);
  }
}
console.log("seed-local done");
