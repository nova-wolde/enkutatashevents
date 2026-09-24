import { Redis } from "@upstash/redis";

// Same prod endpoint used by scripts/migrate-redis.mjs
const REDIS_URL = "https://meowdis.enkutatashevents.workers.dev";
const REDIS_TOKEN = "2047b34adb2c09b5e2cf9d7ec5845adaf2919d2d24ca12f9b5f3a66b2de8e956";
const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });

const KEY = "data:site-content";

const NEW_ADDRESS = "Ayat Mall, 1st Floor, Office No. E1F-19, Ayat, Addis Ababa";
const NEW_ADDRESS_AM = "አያት ሞል፣ 1ኛ ፎቅ፣ ቢሮ ቁጥር E1F-19፣ አያት፣ አዲስ አበባ";

const content = await redis.get(KEY);
if (!content) {
  console.error("FAIL: data:site-content not found in prod Redis");
  process.exit(1);
}

console.log("current address:", content.address);
console.log("current addressAmharic:", content.addressAmharic);

content.address = NEW_ADDRESS;
content.addressAmharic = NEW_ADDRESS_AM;

const setResult = await redis.set(KEY, JSON.stringify(content));
console.log("set result:", setResult);

// Verify
const check = await redis.get(KEY);
console.log("verify address:", check.address);
console.log("verify addressAmharic:", check.addressAmharic);
if (check.address === NEW_ADDRESS && check.addressAmharic === NEW_ADDRESS_AM) {
  console.log("OK: prod CMS address updated");
} else {
  console.error("FAIL: verification mismatch");
  process.exit(1);
}
