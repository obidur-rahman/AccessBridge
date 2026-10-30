const base = "http://localhost:3000";
const listingId = "00000000-0000-4000-8000-000000000005";
const note = `Queue check ${Date.now()}`;

const submit = await fetch(`${base}/api/reports`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    listingId,
    featureStates: { lift: "yes", ramp: "no" },
    observedAt: new Date().toISOString().slice(0, 10),
    note,
    sourceUrl: "",
  }),
});
console.log("submit", submit.status, await submit.json());

const queue = await fetch(`${base}/review`, {
  headers: { cookie: "ab_demo_reviewer=1; ab_lang=en" },
});
const html = await queue.text();
const count = (html.match(/Agrabad General Hospital \(demo\)/g) ?? []).length;
console.log(JSON.stringify({ queueStatus: queue.status, queueRows: count, empty: html.includes("No reports") }));
