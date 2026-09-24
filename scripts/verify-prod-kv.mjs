import { Redis } from "@upstash/redis";

const prod = new Redis({
  url: "https://meowdis.enkutatashevents.workers.dev",
  token: "2047b34adb2c09b5e2cf9d7ec5845adaf2919d2d24ca12f9b5f3a66b2de8e956",
});

for (const [key, label] of [
  ["data:contact-submissions", "MESSAGES"],
  ["data:bookings", "BOOKINGS"],
]) {
  const items = (await prod.get(key)) || [];
  const tests = items.filter((i) => (i.name || "").includes("E2E TEST"));
  const newest = items[0] || {};
  console.log(
    `PROD ${label}: ${items.length} total | ${tests.length} E2E-test entries visible to admin | newest: "${newest.name}" read=${newest.read} status=${newest.status ?? "-"}`
  );
  for (const t of tests) {
    console.log(
      `   -> test entry: "${t.name}" | email=${t.email} | eventType=${t.eventType} | created=${t.createdAt}${t.eventDate ? ` | eventDate=${t.eventDate}` : ""}${t.guestCount ? ` | guests=${t.guestCount}` : ""}`
    );
  }
}
console.log("KV-VERIFY DONE");
