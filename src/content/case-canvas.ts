import type { LongformArticle } from "./longform-types";

/**
 * Case study #2 — Canvas, the image-generation IDE.
 * Rewritten 2026-08-04 to Ash's brief, then tightened same day to a 5–6 minute
 * read: bullets over prose, no meta-verification voice ("git-verified",
 * "counted directly"), captions trimmed. Structure: Higgsfield origin →
 * three panels → two zooms into the app snapshot → comparison → learnings.
 * Prices/counts quoted from the capture (7¢/10¢/63¢). Shutter Labs is a
 * cross-link only.
 * v2 (2026-08-05, owner-directed): status → open-sourced; stat band cut;
 * "three workspaces" phrasing dropped everywhere (workspaces are unbounded);
 * main snapshot swapped for the interactive app-live-demo.html (workspace +
 * research tabs clickable, populated with real generations pulled from the
 * app's Supabase DB into /proof/canvas/gallery/); research-panel-demo.html
 * embed added under the three-modes list; batch-API 50%-discount line added;
 * both markup-walkthrough code blocks and their commentary cut.
 * v3 (2026-08-05, owner-directed): "What I can't show you" section removed;
 * the cheaper-lane / client-state / solo-review learnings cut as wrong; a
 * bullet linking the homepage "Principles of building" section (/#principles)
 * added in their place.
 * v4 (2026-08-05, owner-directed): Decisions and How-it-compares tables cut;
 * replaced by two short prose paragraphs under "Decisions" (tree on the left,
 * research on the right, cost at every decision point, comparison folded in).
 * v5 (2026-08-05, owner-directed): app-live-demo reworked to show the three
 * workspaces side by side with image thumbnails in the project tree; both
 * Zoom sections (composer, project tree) removed as redundant; CC-licensed
 * husky reference photos added for the research panel and Inspiration folder
 * (credits in /proof/canvas/gallery/CREDITS.md).
 * v6 (2026-08-05, owner-directed): "Case study" eyebrow removed (field made
 * optional in longform-types + ArticleLayout); the one-decision callout box
 * demoted to a plain paragraph.
 * v7 (2026-08-09, owner-directed): standard meta card rolled out site-wide —
 * Role / Timeline / Status / Tech; GitHub link added to Status; tags re-cut
 * to signal FDE / AI-PM fit (tech names live in the Tech row now).
 */
export const canvasArticle: LongformArticle = {
  article_title: "Canvas — an IDE for image generation",
  article_subtitle:
    "A three-panel workspace where generations run side by side, research happens next to the prompt, and the price shows up before you hit Enter.",
  article_tags: ["0→1", "Solo build", "Cost-aware UX", "AI product engineering"],
  article_meta: [
    { meta_label: "Role", meta_value: "Designed, built, and shipped solo." },
    { meta_label: "Timeline", meta_value: "March to July 2026." },
    {
      meta_label: "Status",
      meta_value: "Open-sourced: [github.com/as2621-dev/Canvas](https://github.com/as2621-dev/Canvas)",
    },
    {
      meta_label: "Tech",
      meta_value:
        "Next.js + TypeScript · Supabase (Postgres) · Trigger.dev job queue · multi-model routing (Gemini + fal.ai) · half-price batch lane · cost reservation & settlement.",
    },
  ],
  blocks: [
    {
      block_kind: "paragraph",
      is_lede: true,
      paragraph_text:
        "Canvas is what an IDE looks like when it's built for image generation instead of code: your library on the left, generation workspaces in the middle, a research panel on the right, and the price of every run printed on the button before you press it.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Where the idea came from" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "I used to generate images with Higgsfield almost daily, then turn the good ones into video. The loop never changed: type a prompt, wait, switch to ChatGPT to fix the next prompt, switch back, run again. References in a downloads folder, drafts somewhere else, one generation at a time. The waiting was the whole experience.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Developers don't write code in a chat box. They get an IDE — files on the left, editors in the middle, docs on the right, one window. Generating images is work in exactly the same way. So why was I doing it through a prompt box and four tabs?",
    },
    {
      block_kind: "paragraph",
      paragraph_text: "The whole product is one decision: treat image generation as work, not as chat.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "One window, three panels" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "What's below is a live, clickable demo of the whole platform — three workspaces running side by side, the library's folders showing their images on the left, the research panel's modes on the right. Poke around. The generations in it are real outputs from the app's own database. Read it like an IDE:",
    },
    {
      block_kind: "html_embed",
      embed_src: "/proof/canvas/app-live-demo.html",
      embed_title: "Canvas — live interactive demo of the app",
      embed_height: 360,
      embed_caption:
        "A project mid-flight: three workspaces side by side — NBPro on the batch lane, NB2, and Kling3 on video — each with its own prompt, settings, and price on the Generate button. Everything is clickable.",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Left — the library.** Every project and its images, in folders. The file explorer.",
        "**Middle — workspaces.** Each generates and reviews with its own model and settings. The editors.",
        "**Right — the research panel.** Web search, prompt help, and agentic image search. The docs pane.",
      ],
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Left: the library" },
    {
      block_kind: "paragraph",
      paragraph_text: "Every project opens with the same three folders — the split source control already makes:",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Raw images** — where generations land.",
        "**Inspiration** — references and things found elsewhere.",
        "**Finalized** — what you'd actually ship.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Every folder is a live drop target, so filing an image is one drag. My old system was a downloads folder sorted by date.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Middle: parallel workflows" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The panel that exists because of all that waiting. Every workspace has its own model, settings, and queue — in the demo above:",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Workspace A** — NBPro on the batch lane at 1K: broad, cheap exploration.",
        "**Workspace B** — NB2 at 2K: refining the keeper.",
        "**Workspace C** — Kling3 video at 720p: slow, so it's isolated where it blocks nothing.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "When one lane is generating, you move to the next instead of watching. Each header keeps its own count and running cost (`Workspace A — 0 imgs · 0¢`), tabs are color-coded, and you can open as many workspaces as you need. Since each workspace picks its own model, parallel lanes double as model comparison: same prompt, two models, side by side. And for images that don't need to land right now, there's a batch-processing API — slower runs, at a 50% discount.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Right: research without leaving" },
    {
      block_kind: "paragraph",
      paragraph_text: "The third panel exists to kill the second tab. Three modes:",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Search** — the web, inside the panel.",
        "**Ask** — a model rewrites or expands your prompt.",
        "**Plan** — an agentic mode that goes and finds reference images for you.",
      ],
    },
    {
      block_kind: "html_embed",
      embed_src: "/proof/canvas/research-panel-demo.html",
      embed_title: "Canvas — research panel with Search, Ask, and Plan tabs, interactive",
      embed_height: 560,
      embed_caption:
        "The panel itself — click between Search, Ask, and Plan to see each mode, including the agent conversation that goes and finds references.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Results drag straight into a prompt or into Inspiration. Before this, I was the integration layer: search in a browser, screenshot, paste into ChatGPT, carry it all back by hand.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "The price is on the button" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Every run shows its price before you start it — the button itself reads `7¢`, and it updates as you change model, quality, or count. Credits that arrive after the decision are what make generation feel like gambling; real money on the button is the fix. It's honest about quality too: the batch lane is half price but capped at 1K, so the size picker for batch simply doesn't offer 4K. The cheap lane tells you what it costs you at the same moment it tells you the price.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "How a generation actually runs" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Generate posts to an API route that writes a job row; Trigger.dev runs the work; the client subscribes to the job and renders outputs as they land. One submission is one job with N child outputs — the client never tracks images in flight, because client-held state the server can't contradict is how you get spinners that never stop. Cost is reserved at start, settled at completion, and a sweeper reclaims reservations from jobs that die. Self-hosted, on your own Gemini and fal.ai keys, with markup set to zero.",
    },
    {
      block_kind: "chart",
      chart_id: "canvas-architecture",
      chart_caption:
        "The full path: routes in canvas/src/app/api, task ids in canvas/src/trigger, prices in src/lib/pricing.ts. The dashed lane — reserve, poll, sweep — is the billing lifecycle.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Decisions" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The layout is a handful of deliberate calls. The project tree lives on the left because that is where an IDE keeps its files, so the work you are keeping stays one glance away instead of buried in a feed. The research panel lives on the right so looking something up never means leaving the window where the prompt is. And cost shows up wherever a decision happens: every workspace header carries a running total and the average per image, and the Generate button prints the price of the run before you press it.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "That combination is also why Canvas beats the alternatives for real work. Prompt box tools like Higgsfield and Midjourney make you wait in one queue and tell you what you spent afterwards, in credits. ComfyUI gives you real control, but you build the wiring before you get any of it. Canvas puts the files, the research, and the numbers in one window and lets the lanes run side by side. The existing shapes are built around the output. Canvas is built around the work.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Pick problems where model progress is a tailwind.** My last startup monetized a capability gap, and a frontier release erased it — [that story is its own case study](/work/quicsnap-shutter-labs). Canvas sits above the models, so every release makes it better.",
        "**Start smaller than the vision.** I opened this build with a huge requirement doc and got lost inside it. The way out became my [five principles of building](/#principles) — question the requirement, delete, simplify, accelerate, and only then automate.",
      ],
    },
  ],
  article_footer_links: [
    { cta_label: "The story before Canvas →", href: "/work/quicsnap-shutter-labs", cta_variant: "primary" },
    { cta_label: "All projects", href: "/projects", cta_variant: "outline" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
