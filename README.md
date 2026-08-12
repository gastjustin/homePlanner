# Home Project Planner

A small React + Node web app for planning home improvements against a fixed weekly budget.

## What it does

- Tracks multiple home projects and priorities.
- Stores a parts list with quantities, prices, totals, and shopping links.
- Keeps labor estimates separate (they can stay at $0 until you have quotes).
- Adds a configurable contingency percentage.
- Calculates when each project becomes fully funded from a weekly budget.
- Saves changes in the browser using localStorage.
- Exports the plan as JSON.
- Optionally generates a concise planning summary with the OpenAI API.

The starter data includes:

- 9 Craftsman interior doors: 6 × 32", 2 × 24", 1 × 30" (prices left at $0 until the exact Lowe's doors are confirmed).
- Upstairs baseboards: 58 × 12-ft RELIABILT Craftsman primed MDF boards at the planning price of $12.98 each.
- The IKEA BESTÅ living-room project with the final detailed piece list left editable.

## Run it

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal (normally http://localhost:5173).

## Enable the AI summary

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Add your API key to `.env`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-luna
PORT=8787
```

The API key stays on the Node server and is never placed in the browser bundle.

## Next improvements

Good next additions would be:

- Import the exact Lowe's door products and prices.
- Import the exact IKEA BESTÅ piece list and prices.
- Add contractor quotes with contractor name, scope, quote image/PDF, and expiration date.
- Add "already purchased" and "completed" states.
- Add tax by retailer.
- Add a printable/shareable wife-friendly project report.
- Add photos/mockups for each project.

## Seeded project data (Aug 12, 2026)

The demo is now seeded with the recovered project details from the earlier planning conversations:

- **Doors:** 9 RELIABILT 3-panel Craftsman primed hollow-core slab doors — 6 × 32×80, 2 × 24×80, 1 × 30×80 — with the Lowe's product links and planning prices identified in the prior door conversation.
- **Baseboards:** ~600 linear ft scope, ~15% waste target, 58 × 12-ft RELIABILT Craftsman MDF boards.
- **BESTÅ wall:** 175-in wall, 95-in ceiling, 85-in wall-mounted TV, asymmetrical 165 3/8-in cabinetry plan with a 94 1/2-in TV zone, 23 5/8-in right tower, and 47 1/4-in side console.

The BESTÅ section intentionally marks the remaining frames/fronts/shelves/hinges/suspension rails as **not final**. The exact finish and complete IKEA shopping list were not fully recoverable, so the app does not pretend those costs are final. Current candidate frame prices can be edited at any time.
