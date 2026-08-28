# Drug Requisition System

```
██████╗ ██████╗ ██╗   ██╗ ██████╗ ██████╗██╗   ██╗██████╗
██╔══██╗██╔══██╗██║   ██║██╔════╝██╔════╝██║   ██║██╔══██╗
██║  ██║██████╔╝██║   ██║██║  ███╗██║     ██║   ██║██████╔╝
██║  ██║██╔══██╗██║   ██║██║   ██║██║     ██║   ██║██╔═══╝
██████╔╝██║  ██║╚██████╔╝╚██████╔╝╚██████╗╚██████╔╝██║
╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝
```

---

## ◆ PULSE

A hospital does not run on goodwill; it runs on supplies that arrive.
This system carries a requisition from the primary care unit that needs
the drug to the hospital that holds it - draft, submit, approve, fulfill -
with every step visible to both sides. PCU staff order from a categorized
catalog, administrators edit quantities and generate the official
documents, and the warehouse picks against a master summary. The paper
work follows the work, not the other way around.

| Draft ▣ | Submitted ▣ | Approved ▣ | Fulfilled ▣ |
|---|---|---|---|

*The full lifecycle - ordering, approval, item control, reporting - is
sealed and serving.*

> Built with Vue 3 + Pinia + Vite, typed by TypeScript, guarded by Biome,
> backed by Supabase with Row-Level Security on every table.
>
> **suradet-ps**, artifact keeper

---

## ◆ IGNITION

One runtime, four commands.

```
⟫ bun install
⟫ bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

```
⟫ bun run check       # formatter + linter + assist
⟫ bun run typecheck   # vue-tsc, strict types
⟫ bun run build       # type-check, then production build
```

<details>
<summary>Supabase setup</summary>

1. Create a project on [Supabase](https://supabase.io/).
2. Run the SQL scripts in the SQL Editor: tables (`items_drugcupsabot`,
   `requisitions_drugcupsabot`, and friends) plus their RLS policies.
3. Copy the Project URL and `anon` key into `.env`:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

</details>

---

## ◆ ANATOMY

Two roles, one lifecycle, a handful of honest states.

- **Orders** - PCU staff search a categorized catalog, save drafts, and
  submit requisitions that carry their status openly: Draft, Submitted,
  Approved, Fulfilled. Locked items are marked with the administrator's
  note and cannot be ordered - no dead-end rows in the cart.
- **Approves** - administrators review every requisition, adjust approved
  quantities, and move the work forward. The dashboard aggregates all
  incoming requests from every PCU at once.
- **Controls** - items are managed centrally: name, price, unit,
  availability toggle, and notes that travel to the PCU screens. Out of
  stock is a state, not a surprise.
- **Reports** - official per-PCU requisition forms auto-populated with
  personnel details, a landscape master summary for warehouse picking,
  and `.xlsx` export - the documents the pharmacy signs are generated,
  not assembled by hand.
- **Guards** - authentication is role-based, Row-Level Security keeps each
  PCU's data in its own drawer, and the complex server-side logic lives
  in Supabase RPC functions instead of client code.

---

## ◆ RITUALS

**The core ceremony** - a requisition's journey:

1. The PCU user searches the catalog, drafts the list, and submits.
2. The status flips to Submitted; the dashboard shows it to the hospital.
3. The administrator reviews, edits approved quantities, and approves -
   or returns it with the reason attached.
4. The warehouse prints the landscape summary, picks against it, and the
   status lands on Fulfilled.

**The ceremony of the locked item** - a drug that is out of stock is
visible, annotated, and unorderable. The PCU learns why, in the
administrator's own words, before the cart is built.

**The ceremony of the document** - the requisition form carries the
configured requester and receiver for each PCU, auto-filled, printable,
and exportable to Excel. The report is the record; the record is the
report.

---

## ◆ ECHOES

**Where this artifact is heading**

```
ordering   ▸ catalog, draft, submit, status tracking ────────────── ▸ sealed
oversight  ▸ approval workflow, item control, notes ──────────────── ▸ sealed
reporting  ▸ per-PCU forms, landscape summary, xlsx export ───────── ▸ sealed
```

**Raising the artifact** - the design language lives in `DESIGN.md`; the
quality bar is Biome (`bun run ci` fails on any issue) plus `vue-tsc`
type-checking. Contributions are welcomed through the usual fork, branch,
and pull request path.

**Status** - every push is gated by the [CI workflow](.github/workflows)
on the way to Vercel.

---

```
  ─────────────────────────────────────────
   Every requisition is a promise
   between a clinic and a shelf.
  ─────────────────────────────────────────
```

Open source under the [MIT License](LICENSE).