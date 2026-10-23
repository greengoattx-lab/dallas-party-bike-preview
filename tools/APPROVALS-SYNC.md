# CS-012 Approvals mirror (OFF)
- `node tools/approvals-sync.mjs` = dry run (prints payloads, sends nothing).
- Goes live only when all three are true: `approvals/sync-config.json` `"enabled": true` (after Approvals intake is live and Chris approves), `BOT_API_KEY` set in the box job's environment (never in git or the browser), and the `--send` flag.
- The routine keeps `approvals/requests.json` (one entry per request, status submitted → building → ready_for_review → approved → live) and runs the script after each change; it upserts by site+requestId, posts status changes, includes CS-011 after shots, and pulls Approvals-page decisions into `approved-pending.json`.
- In-chat approvals: the routine sets that request's status to `approved` in requests.json, which the sync posts (this disables Approve on the page). Publishing stays on this site only.
- Backfill: the first live run posts every request in requests.json (currently none open for Party Bike).
