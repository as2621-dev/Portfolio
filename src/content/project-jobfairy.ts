import type { LongformArticle } from "./longform-types";

/**
 * Project page — JobFairy, the job-search copilot (filters incl. the H-1B
 * sponsor filter, agent research, in-place resume tailoring, agent-filled
 * applications, Instantly/Waalaxy outreach).
 *
 * Reframed (Ash, 2026-08-12): JobFairy is for EVERY job seeker — the H-1B
 * sponsor filter is a core feature inside the system, never the product's
 * identity. Walkthrough-first structure, mostly screenshots. All
 * `/proof/jobfairy/beta-2026-08-12/` images were captured from the live beta
 * build (local run against the production Supabase) on 2026-08-12, signed in
 * as the owner account, using data already in the database — no new research
 * or tailoring runs were launched for the captures.
 */
export const jobfairyArticle: LongformArticle = {
  article_eyebrow: "Project · Agents & tools",
  article_title:
    "JobFairy — a job-search copilot that researches every role, tailors the resume, fills the application, and reaches the hiring team",
  article_subtitle:
    "JobFairy is for anyone running a serious job search. You set your filters once — title, seniority, remote or a place, salary — and the system does the grind: it pulls live openings, researches each role, rewrites your resume for it, fills the application with a browser agent, and drafts personalized outreach to the people who will actually read it, sent through Instantly so it lands in the inbox and through Waalaxy on LinkedIn. The sharpest filter is the H-1B one: JobFairy carries five years of US Department of Labor filing data, so H-1B candidates can restrict the whole search to companies with a verified record of sponsoring — a filter inside the system, not the product itself.",
  article_tags: [
    "Job-search copilot",
    "H-1B smart filter",
    "Agent research",
    "Resume tailoring",
    "Agent-filled applications",
    "Email + LinkedIn outreach",
    "Solo build",
  ],
  article_meta: [
    { meta_label: "Role", meta_value: "Designed, built, and shipped solo." },
    {
      meta_label: "Timeline",
      meta_value: "[CONFIRM: build timeline — start/end dates are not in the copy or the PRD excerpts]",
    },
    {
      meta_label: "Status",
      meta_value:
        "In beta testing — the multi-user build in these screenshots is live and iterating week to week. [SLOT: GitHub link — CONFIRM repo URL]",
    },
    {
      meta_label: "Tech",
      meta_value:
        "TypeScript + Next.js · Supabase · Trigger.dev · Railway · research agents with a verifier gate · Browserbase fill agent · python-docx resume tailoring · DOL LCA data pipeline · TheirStack job ingest · Apollo.io, Instantly & Waalaxy outreach.",
    },
  ],
  blocks: [
    { block_kind: "act_divider", act_eyebrow: "Act 1", act_title: "The problem", anchor_id: "act-1" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "This one started at home. My wife holds an H-1B, and I watched the job search eat her evenings for months. Anyone who has hunted for a job knows the loop; her visa just made every lap of it longer. The manual version goes like this:",
    },
    {
      block_kind: "numbered_list",
      list_items: [
        "Open LinkedIn and the job boards. Again. →",
        "Stack the filters and scroll. →",
        "Research each interesting company — does it actually sponsor H-1B? The “visa sponsorship: yes” checkbox is self-reported, the lookup sites carry stale data, and half the time you end up with partial information and no answer. →",
        "Rewrite the resume for the role. There goes the evening. →",
        "Fill the application form by hand, field by field. →",
        "Hunt down the hiring manager and write something personal. →",
        "Send it from a personal Gmail — where cold mail gets flagged fast and sits in spam.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Every step is manual, every step repeats for every single role, and the chain breaks anywhere. JobFairy runs that whole chain as one system — for any job seeker. The H-1B check becomes one filter inside it, answered from government filing data instead of guesswork.",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 2", act_title: "The product, in screenshots", anchor_id: "act-2" },
    { block_kind: "heading", heading_level: 3, heading_text: "Filters — set once" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Preferences hold the whole search: the titles you actually apply to, seniority, years of experience, remote or on-site, employment type, country, how fresh a posting has to be, and target salary. On top of them sits the H-1B sponsor filter — every company downstream carries verified sponsorship filings, not a self-reported checkbox.",
    },
    {
      block_kind: "image",
      image_src: "/proof/jobfairy/beta-2026-08-12/preferences-filters.png",
      image_alt:
        "JobFairy's Preferences screen: H-1B sponsor chips on top, then job titles, seniority, years of experience, work arrangement, employment type, country, posting age, and target salary filters.",
      image_caption:
        "real product — Preferences in the beta build, captured 2026-08-12: the H-1B sponsor filter above the profile filters that drive every scan.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Jobs — everything live, in one place" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The Jobs tab is every live opening that matches your preferences across the tracked companies, deduped and freshest first. The beta adds a reveal step — titles come free, and a daily allowance of reveals goes to the ones worth a closer look, which is what keeps per-user data costs sane.",
    },
    {
      block_kind: "image",
      image_src: "/proof/jobfairy/beta-2026-08-12/jobs-tab.png",
      image_alt:
        "JobFairy's Jobs tab listing 307 matched product-management postings with posted dates and Reveal / Pass actions on each row.",
      image_caption: "real product — the Jobs tab in beta, captured 2026-08-12: 307 matched postings, Reveal or Pass.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Companies — each with its sponsorship record" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The Companies tab carries the H-1B filing history for every company in your search, filterable by filing volume. A company page puts its live jobs on top — and the people who matter underneath.",
    },
    {
      block_kind: "image",
      image_src: "/proof/jobfairy/beta-2026-08-12/companies-tab.png",
      image_alt:
        "JobFairy's Companies tab: thirteen companies with per-company LCA filing counts, pending/applied/passed job columns, and an LCA min/max filter bar.",
      image_caption:
        "real product — Companies in beta, captured 2026-08-12: each company with its LCA filing count, filterable by volume.",
    },
    {
      block_kind: "image",
      image_src: "/proof/jobfairy/beta-2026-08-12/company-realpage-top.png",
      image_alt:
        "A JobFairy company page for RealPage, Inc. showing a verified H-1B sponsor badge with 82 LCAs since 2021, two live product-management openings with salaries, and the top of a 138-person key-decision-makers list.",
      image_caption:
        "real product — a company page, captured 2026-08-12: the verified “H-1B sponsor · 82 LCAs since 2021” badge, live jobs with salary, and 138 key decision makers underneath, each one click from a workspace.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Open a job — the homework is already done" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Click into a job and the agent research is waiting: what the ideal candidate looks like, company intel, interview intel — every bullet verified and cited before it is allowed to persist. A keyword scan shows what the posting asks for that your resume doesn't say yet, and the resume pane on the right is where tailoring lands: rewords stay fact-anchored, and you accept or reject each change.",
    },
    {
      block_kind: "image",
      image_src: "/proof/jobfairy/beta-2026-08-12/workspace-research.png",
      image_alt:
        "A researched job workspace for Product Manager, Billing at Omada Health: the job description and verified agent-research bullets with source links on the left, the resume.docx tailoring pane on the right.",
      image_caption:
        "real product — a researched job workspace, captured 2026-08-12: six verified ideal-candidate bullets plus company and interview intel, every one cited; the resume pane sits on the right.",
    },
    {
      block_kind: "image",
      image_src: "/proof/jobfairy/beta-2026-08-12/workspace-apply-slice.png",
      image_alt:
        "The same job workspace further down: a keyword gap showing 13 posting keywords missing from the resume, the Apply card, and the Fill-application-with-agent section with a provider comparison and a Fill via Browserbase button.",
      image_caption:
        "the same workspace, further down — the keyword gap, the Apply card, and the fill agent. The agent fills but never submits: you review, and the application is only marked Applied when a real confirmation email arrives.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "People — outreach that lands in the inbox" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Even a strong application can sit unread, so JobFairy works the human side too. Pick a person and the agent researches them first, then drafts the outreach: a three-touch email sequence and a LinkedIn note, personalized from cited findings and capped at lengths a human would actually write. Nothing sends without your approval. Email goes out through Instantly — because a personal Gmail blasting cold mail gets flagged within days, and deliverability infrastructure is the difference between an inbox and a spam folder. LinkedIn outreach runs through Waalaxy.",
    },
    {
      block_kind: "image",
      image_src: "/proof/jobfairy/beta-2026-08-12/person-amanda.png",
      image_alt:
        "A JobFairy person workspace: cited person-research findings on the left, and on the right a drafted Day 1/4/10 email sequence and a LinkedIn connection note, with Save for later and Schedule send buttons and the line “Nothing sends without your approval.”",
      image_caption:
        "real product — a person workspace, captured 2026-08-12: cited person research on the left; the drafted Day 1 / 4 / 10 email sequence and LinkedIn connection note on the right. “Nothing sends without your approval.”",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The H-1B data underneath" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The filter is built on the US Department of Labor's own LCA disclosure files: 2,630,454 filings distilled to 31,926 companies with at least five filings across the last three fiscal years in tech-adjacent roles. That's the difference between a checkbox that says “sponsors visas” and a public record that proves it.",
    },
    {
      block_kind: "image",
      image_src: "/proof/jobfairy/stage2-company-list.png",
      image_alt:
        "JobFairy's company list rendering 2,630,454 LCAs across 31,926 companies, with per-company H-1B filing counts for FY2021 through FY2025 and track buttons.",
      image_caption:
        "real output — the full asset: “2,630,454 LCAs across 31,926 companies,” per-company filings FY2021–FY2025 (Puppeteer capture from the 2026-07-18 verification pass).",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 3", act_title: "How it's built", anchor_id: "act-3" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "TypeScript end to end on Next.js, Supabase for data and auth, Trigger.dev for every long-running job, deployed on Railway. Jobs arrive through TheirStack, which watches the ATS platforms so I don't have to. The research agents run behind a verifier that gates every bullet before it persists. Resume tailoring is the one Python exception — python-docx doing run-level edits inside a Trigger.dev task, because nothing in TypeScript edits a `.docx` in place without reflowing it.",
    },
    {
      block_kind: "chart",
      chart_id: "jobfairy-pipeline",
      chart_caption:
        "Every box maps to the source tree: sourcing and job ingest build the data asset (blue); research, tailoring, the fill run and confirmation run once per application (orange). The dashed arrow is the honesty rule: a succeeded fill only writes `awaiting` — a matched confirmation email promotes it to `applied`.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "The browser-agent bake-off",
      anchor_id: "bakeoff",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The fill step needed a browser agent, so I tested two providers head to head on the same live application — Browser Use and Browserbase + Stagehand — one real run each, through the real fill engine, with cost and step caps in force and every number persisted to the database. Browserbase won because it got the job done: the resume attached in one tool call, while Browser Use burned its entire step cap without ever attaching the file.",
    },
    {
      block_kind: "chart",
      chart_id: "bakeoff-comparison",
      chart_caption:
        "Read the multipliers as this run vs this run, not as a rate — one arm ran to its step cap, the other stopped after a single action. Total money that actually left the account: $1.1532.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Don't reinvent the wheel.** I spent the early weeks building job ingestion the hard way — going ATS by ATS, writing connectors and scrapers against roughly twenty vendors, fighting markup drift and rate limits, because most of them never expose a clean public API. Then I found TheirStack, which already aggregates live postings across the ATS world, and replaced my entire ingestion path with one integration. If someone has already solved the problem, build on top of them — the moat was never going to be the scraping.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Don't let the agent grade its own homework.** A fill agent reporting `submitted: true` is the model's opinion, not a fact — at the API boundary it is indistinguishable from a hallucination. So the system never takes the agent's word: a finished fill run only moves an application to `awaiting`, and only a matching confirmation email in Gmail promotes it to `applied`. Any claim an agent makes about the world needs a verification path that doesn't run through the agent.",
    },
    {
      block_kind: "callout",
      callout_tint: "sun",
      callout_title: "Beta",
      callout_text:
        "JobFairy is in beta testing right now — the multi-user build in these screenshots is live, and the surface changes week to week.",
    },
  ],
  article_footer_links: [
    { cta_label: "All projects →", href: "/projects", cta_variant: "primary" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
