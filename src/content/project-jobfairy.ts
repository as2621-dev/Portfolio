import type { LongformArticle } from "./longform-types";

/**
 * Project page — JobFairy, the H-1B job-search copilot and the browser-agent
 * bake-off. Source of truth: ~/"Portfolio "/copy/07-project-jobfairy.md.
 * Framing locked (Ash, 2026-08-02): build-and-evaluate — no outcome numbers.
 */
export const jobfairyArticle: LongformArticle = {
  article_eyebrow: "Project · Agents & tools",
  article_title: "One application, two browser agents, $1.15 — and a provider decision that stuck",
  article_subtitle:
    "A job-search copilot on top of 31,926 verified H-1B sponsor companies — and the part worth showing you is how I picked its browser-automation provider: one real ATS application, run head to head for real money. Browser Use burned $1.1356 over 4m 44s and never attached the resume. Browserbase + Stagehand finished in 9.3 seconds for $0.0196 with the file attached. I deleted an arm I had already built.",
  article_tags: ["Browser agents", "Next.js", "Evals"],
  article_meta: [
    { meta_label: "Role", meta_value: "Designed, built, and shipped solo. [SLOT: GitHub link — CONFIRM repo URL]" },
  ],
  article_stats: [
    { stat_value: "$0.02 vs $1.14", stat_label: "per task — same live Greenhouse posting, one run per provider" },
    { stat_value: "31,926", stat_label: "sponsor companies from 2,630,454 LCA filings" },
    { stat_value: "59", stat_label: "numbered PRD decisions, six of them reversals" },
  ],
  blocks: [
    {
      block_kind: "callout",
      callout_tint: "blue",
      callout_title: "How to read this piece",
      callout_text:
        "This is a build-and-evaluate story: the deliverable is the provider decision and the evidence behind it, not a job offer. I never instrumented my own search, so there is no applications-sent count, no reply rate, and no interview number in here. The one live application run ended at status `awaiting` and never reached `applied`. I’d rather say that plainly than dress up an engineering result as an outcome.",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 1", act_title: "The product decision", anchor_id: "act-1" },
    { block_kind: "heading", heading_level: 3, heading_text: "What I built" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "JobFairy turns raw US Department of Labor LCA disclosure filings into a list of companies that demonstrably sponsor H-1B visas, pulls live openings at those companies, then runs the pipeline per job: research on the company and role, in-place tailoring of my `.docx` resume, a browser agent that fills the actual ATS application, contact resolution, and a short personalized email. Roughly 20 ATS connectors sit behind the apply step.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Who it’s for" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "H-1B-dependent job seekers: people who can only accept an offer from a company willing to sponsor them. It’s an unusually sharp ICP, because the constraint is binary and invalidates most of the job market before they read a single description. I was user number one — first-person and falsifiable, and n=1. I later forked the engine into a multi-user version and never onboarded anyone, so I make no claims about another person’s search.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Why this problem, and what I ruled out" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The market splits into two halves that never meet. Job boards have live feeds and no reliable sponsorship signal — the “visa sponsorship: yes” checkbox is self-reported and frequently wrong. H-1B lookup sites (MyVisaJobs, H1BGrader, Interstride) have real DOL filing data and no live jobs: they tell you who *filed* in 2023, not who is *hiring* today. Between them sit tools that each solve one adjacent slice — sponsorship filtering without verified contacts, contact lookup without sponsorship data, manual CRMs — and above them, human reverse-recruiting agencies at $500–$15,000 a month. My scan concluded “direct combined competitor: none,” which is usually a warning sign, so the wedge had to be narrower than a feature list.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "How it’s different: the data asset is the product" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "I ingest the DOL OFLC disclosure files directly — bulk `.xlsx`, deliberately not scraped — and qualify a company on a stated rule: **at least 5 filings across 3 years in tech-adjacent SOC codes.** That yields **31,926 companies drawn from 2,630,454 filings**, of which **28,723** also carry live openings. That intersection is the product: a sponsorship signal from the government’s own filings, joined to jobs open today. I wrote down what the rule is *not*, too — five filings is a proxy for “has an engineering org,” not an industry claim, so it misses first-time sponsors and includes companies that stopped hiring.",
    },
    {
      block_kind: "media_slot",
      slot_description:
        "stage2-company-list.png — the company list rendering “2,630,454 LCAs across 31,926 companies” (ready to place)",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 2", act_title: "How it’s built", anchor_id: "act-2" },
    { block_kind: "heading", heading_level: 3, heading_text: "Architecture" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "TypeScript end to end on Next.js, Supabase for data, Trigger.dev for every long-running job, deployed to Railway. Two of those were arguments with myself. **Supabase over Convex**, because the data is relational with cross-table dedup queries and there’s no real-time multiplayer need — the thing Convex is actually good at. **TypeScript over Python for the agent layer**, contradicting my own default: a second runtime and deploy target for a handful of LLM calls was disproportionate scope. The one exception is resume tailoring — Python `python-docx` doing run-level edits inside a Trigger.dev task, because nothing in TypeScript edits a `.docx` in place without reflowing it.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Where browser agents actually break" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "A browser agent is a model that can see a page and act on it. The design question isn’t “can it,” it’s **how much of the task you let it decide** — and my two providers sat at opposite ends of that spectrum.",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Browser Use is agent-driven.** Navigation *and* the file attach are the model’s judgment. If the model wanders, it takes the attach with it.",
        "**Browserbase + Stagehand is code-driven.** My driver navigates, then attaches the resume deterministically over CDP `setInputFiles`. The model is asked only to do what code cannot.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Both sit behind one interface — `startFillRun(postingId, provider)` — returning a persisted run with status, duration, cost and a replay link. I built that seam before I knew which arm would win, which is the only reason the experiment was cheap to run.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "The bake-off: two providers, one application, $1.15",
      anchor_id: "bakeoff",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Hypothesis.** A code-driven agent beats an agent-driven one on cost, latency *and* reliability for ATS form-filling — not because the model is better, but because the file attach shouldn’t depend on the model behaving.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Method.** One real run per provider against the same target: a live, public, login-free Greenhouse posting (Technical Product Manager at SupplyHouse Nevada LLC), the same 39 KB tailored `.docx`, launched through the real fill-run engine onto a real Trigger.dev worker. Caps in force: $2.00 max cost plus a 60-step poll-side cap on Browser Use; a 15-minute session and 40 fill steps on Browserbase. Every cost input persists to the database — `duration_ms`, `cost_usd numeric(10,4)`, a `cost_breakdown` blob — so the number is auditable, not asserted.",
    },
    {
      block_kind: "chart",
      chart_id: "bakeoff-comparison",
      chart_caption:
        "Read the multipliers as this run vs this run, not as a rate — one arm ran to its step cap, the other stopped after a single action. Total money that actually left the account: $1.1532.",
    },
    {
      block_kind: "table",
      table_header: ["", "Browser Use", "Browserbase + Stagehand"],
      table_rows: [
        ["Status", "**failed** — hit the 60-step cap", "**succeeded**"],
        ["Duration", "284,429 ms (4m 44s)", "9,295 ms"],
        ["Cost", "**$1.1356** billed, provider-reported", "**$0.0196** computed ($0.0176 of it real token spend)"],
        ["Tokens", "2,076,810 in / 10,027 out", "11,355 prompt / 63 completion"],
        ["Resume attached?", "**No**", "**Yes**"],
        ["Steps", "60 (the cap)", "1 tool call"],
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Reading the result honestly.** The write-up records “~58× cheaper as recorded” and then immediately disciplines its own headline: *read those multipliers as this run vs this run, not as a rate.* One arm ran to its step cap; the other stopped after a single action. A fairer cap-to-cap comparison prices Browserbase’s 40-step ceiling at a modelled floor of ~$0.68 against Browser Use’s ~$1.14 — about **1.7×**, which still favours Browserbase and is far less dramatic. Two caveats went in the document, not a footnote: Browserbase publishes no cost endpoint, so $0.0196 is my formula, not a bill; and the base resume was still a 32-character stub, so the agent had almost nothing to type. “Succeeded” means the deterministic attach resolved and the agent self-reported success. It is **not** evidence that either arm can complete a multi-field screening form. I didn’t invent applicant contact details to make the runs look better.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The decision.** Browserbase became the sole fill provider and the Browser Use arm was deleted. The 58× was never the reason — the architecture was. Two Browser Use runs a week apart ended in the same off-script state (`Running Python code`), including one that cost **$5.55 across 163 steps.**",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "59 decisions, six reversals — and the one I argued hardest against myself",
      anchor_id: "decisions",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Every decision in the PRD states what it rules out; six explicitly overturn an earlier one, and a “superseded / retained” section exists so the document can never hold two contradictory halves. The bake-off above only happened because of one of them — Decisions 42 and 44 de-scoped in-app fill entirely, and Decision 47 put it back on the critical path. But the reversal that taught me the most is a different one:",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Decision 23 → Decision 48: I argued myself out of auto-submit, then reversed it and kept the strongest objection as a mechanism.** The original position had three good reasons. Workday’s and Greenhouse’s terms bar automated interaction, so the ToS risk lands on the *user’s* candidate account, not mine. Greenhouse ships invisible reCAPTCHA scoring mouse movement and typing patterns — exactly the signature an agent produces. And `submitted: true` from an agent is **the model’s opinion that it submitted**, which at the API boundary is indistinguishable from a hallucination.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Decision 48 reversed the conclusion for runs the user explicitly launches, but that third objection never went away, so it became a control instead of a veto: a succeeded fill run only moves an application to `awaiting`. **Only a matched confirmation email promotes it to `applied`.** The agent isn’t allowed to be the witness to its own success.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**A prompt sentence is not an enforcement mechanism.** I added an explicit line — “do NOT run or write code, do NOT open a terminal or a Python tool” — and the agent went off-script into Python anyway, twice, before and after the hardening. Constraints you want honoured live in code.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**A cap that never engages is not a cap.** The $2.00 cost ceiling never fired; the 60-step ceiling did, at $1.1356. I’d instrumented the limit that felt like a safety net, not the one that binds.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Observability without a control is worth less than it looks.** I diagnosed the stall live at step 9, with $0.25 spent, then watched it burn **$0.89 more** because the live view had no stop button. The user story promised you could “step in if it stalls.” Exactly half of that was true.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Discipline your own headline number.** “58× cheaper” was the fact I most wanted to be true, which is precisely why the 1.7× model had to be published beside it. A number that only survives its most flattering framing isn’t a result, it’s a slide.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Honest status" },
    {
      block_kind: "bullet_list",
      list_items: [
        "**No real-search outcome data.** No applications-sent count, no reply rate, no interviews. The one live application run sits at `awaiting`.",
        "**No demo of the agent filling a form** — the visceral part. Browser Use’s live-view recordings existed, but the replay URLs are presigned with a one-hour expiry and are now dead. A re-run is the only path to a GIF. [SLOT: demo GIF, requires re-run]",
        "**12 real product screenshots exist** (puppeteer-captured, sample data only, no PII). [SLOT: stage3-research-outcome.png — per-job research output] [SLOT: stage6-resume-pane.png — the resume tailoring pane]",
        "**The multi-field fill is still unproven,** and so is ATS-side acceptance of the attach. Both need a re-run against a real base resume.",
        "**Zero external users** on the multi-user fork, and no user research beyond my own.",
      ],
    },
  ],
  article_footer_links: [
    { cta_label: "All projects →", href: "/projects", cta_variant: "primary" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
