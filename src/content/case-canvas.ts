import type { LongformArticle } from "./longform-types";

/**
 * Case study #2 — Canvas, the post-Shutter-Labs image workspace.
 * Source of truth: ~/"Portfolio "/copy/03-case-study-canvas.md.
 * Commit/test counts are deliberately omitted until reconciled (VERIFY tags
 * inline); no usage metrics exist and the copy says so plainly.
 */
export const canvasArticle: LongformArticle = {
  article_eyebrow: "Case study",
  article_title: "The model that killed my startup is a line item in my pricing table",
  article_subtitle:
    "Canvas — a self-hosted image-generation workspace with three parallel lanes, six models, and the price printed on the button before you press it.",
  article_tags: ["0→1", "Multi-model routing", "Solo build"],
  article_meta: [
    { meta_label: "Role", meta_value: "Designed, built, and shipped solo." },
    { meta_label: "Timeline", meta_value: "23 March to 26 July 2026, both commits git-verified." },
    {
      meta_label: "Status",
      meta_value: "My daily driver; prepped for open-source release, repo not yet public [CONFIRM: repo URL].",
    },
    { meta_label: "Lineage", meta_value: "Pigment (Feb–Mar 2026), then Canvas." },
  ],
  article_stats: [
    { stat_value: "252", stat_label: "TypeScript source files · 28 Postgres migrations" },
    { stat_value: "19", stat_label: "unique working days across four months" },
    { stat_value: "½", stat_label: "batch lane price vs instant — ₹5.70 vs ₹11.39" },
  ],
  blocks: [
    {
      block_kind: "paragraph",
      is_lede: true,
      paragraph_text:
        "`nano_banana_pro` sits in the pricing table at `canvas/src/lib/pricing.ts:34`, quoted at ₹11.39 an image instant, ₹5.70 batch. It’s also the model that ended Shutter Labs — Google shipped fine-print-preserving product imagery inside a general-purpose model, which was the entire thing my company sold. [Read the flagship story →](/work/quicsnap-shutter-labs)",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Canvas is what I built after. Same domain, inverted posture: I stopped betting against frontier models and built the workspace that routes to them.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The stat band above is counted directly — file and migration counts match the planning docs, and working days are distinct commit dates, not an effort estimate. Commit and test counts are omitted until reconciled [VERIFY: commits 185/190/187 across sources; tests 422/471/480 in docs, 471–730 by scan]. No usage metrics exist at all — see Results.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "The problem" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The user is me, then about thirty or forty people I know [CONFIRM: Ash-supplied, never instrumented].",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "I generate images daily — a habit, not an experiment. Higgsfield generated, ChatGPT sat in a second tab rewriting prompts that didn’t land, and nothing held the project itself: reference shots, versions, the thread of what I was trying. It broke on a deadline. I needed video, one generation could run at a time, so work went single-file — start it, wait, switch tabs, rework, switch back, rerun. The round trip *was* the cost.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Four frictions, none of them the model. **Idle waiting** — one prompt, one queue, and the watching is time the next direction never gets. **Credits vanish blind** — cost lands after the decision, in a unit the tool invented, and a failed generation can still take the credit with it (Adobe bug 1558296: 200 credits burned by failures). **Assets scatter** — a week later the image is in a download folder, indexed by nothing but when it was made. **Ideation lives in another tab** — the tool starts at the prompt box, so the looking happens elsewhere and comes back as screenshots.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Existing tools take two shapes and both miss. Krea, Midjourney’s web app, Leonardo: a prompt box above a scrolling feed. ComfyUI and the node canvases offer real parallelism but charge pipeline literacy for it — you build the wiring before you get the concurrency. Both are built around the *output*; I wanted one built around the *work*.",
    },
    {
      block_kind: "callout",
      callout_tint: "orange",
      callout_text:
        "I picked this problem because being wrong about it is cheap. Shutter Labs needed a capability gap to persist. Canvas gets better every time a model ships.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Process" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Pigment came first, and I killed it.** An internal AI content studio for a three-person ecommerce team, spec’d as a 714-line PRD at v3.0 — two personas, eight user stories, a nine-table schema, a risk register, eleven phases — and shipped in 53 commits. The personas were specific enough to design against: *“Technical comfort: Intermediate — comfortable with web apps, not with APIs or prompt engineering… manages 1-5 active projects, generates 10-50 images/day.”* [SLOT: pull one verbatim user story, US-1…US-8, from the Pigment PRD]",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Canvas’s first commit lands **two days** after Pigment’s last. What I gave up was the ecommerce specificity — brand guidelines, shot lists, admin analytics — because the narrow version needed a three-person team to justify it and I only had the workflow.",
    },
    {
      block_kind: "table",
      table_header: ["Decision", "Rejected alternative", "Why it lost"],
      table_rows: [
        [
          "Three workspaces in parallel",
          "Prompt, generate, wait",
          "That wait is dead time. Three at once means always producing — batch in one, refinement in another, video isolated so it blocks nothing.",
        ],
        [
          "Planning as a conversation",
          "Separate search and prompt-enhance tabs",
          "Two one-shot tools left the user as the integration layer. A thread produces prompts and reference rows together.",
        ],
        [
          "Live price on the Generate button",
          "Show cost once the run completes",
          "The estimate has to be readable *before* the run, not only after.",
        ],
        [
          "Generation as a background job",
          "Generate inline in the API request",
          "Keeps the route fast, gets retries free. It also forces the harder question: a job that dies hard runs neither its success nor its failure path, so the reservation needs a sweeper.",
        ],
      ],
      table_caption:
        "A fifth row got cut in review because its only source was the page’s own PRD — circular. That became a rule: a decision-table row must cite a document that predates the decision.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The redesign.** Canvas began as a Stitch prototype, “Creator Studio IDE” — INSTANT column, BATCH and QUEUED lanes, an inspiration panel. I graded my own prototype: seven things right, ten wrong, including *“9px, 10px, 11px fonts make the interface feel like a developer tool, not a creative tool.”* The shift I wrote down: *from IDE-density developer tool, to minimal creative studio with IDE power underneath.* Shipped, the BATCH/QUEUED lanes became three named colour-coded workspaces and the single search became a three-mode planning panel.",
    },
    {
      block_kind: "media_slot",
      slot_description: "before → after — Stitch concept beside the shipped three-panel app",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The reversal.** I shipped generation wrong first: asking for three images fanned out three independent client calls, each polled against a five-minute ceiling. The row was inserted *before* the Trigger.dev call, so an offline worker left it at `queued` forever while the catch block returned a 500 and never updated it — spinners that never terminated. My diagnosis: *the client holds in-flight UI state the server can’t authoritatively contradict.* The rebuild made it job-as-aggregate — one submission, one job row, N child outputs, client subscribes to the job and never the children.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What shipped" },
    { block_kind: "media_slot", slot_description: "hero — full three-panel app, three workspaces mid-generation" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Left, the project tree.** Every project opens with the same three folders: Raw, Inspiration, Finalized — the separation source control already makes between inputs, references, and outputs, and the one taxonomy that survives a project getting big. Everything drags; a feed can only be scrolled.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Centre, three parallel workspaces**, each with its own model and settings — one on a heavy batch, one refining, one on video, which is slow enough it would otherwise block everything. Green, purple, amber answers the only question you ask when you look up: which one was I in. Three is a starting setup, not a ceiling.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Multi-model routing.** Six models behind one type-checked union — three image, three video. A single `MODEL_KIND_MAP` is the source of truth every pricing and UI branch reads, so adding a model is a table row, not a refactor. Model choice lives *inside* each workspace, making aggregation a way to compare models rather than a count of logos.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        '**Two lanes, honestly priced.** Batch runs at exactly half price, and the trade-off is enforced in code: batch is capped at 1K, because that’s all Gemini’s batch API renders. `getAvailableSizes()` returns `["1K"]` for batch rather than offering a 4K option the API would reject. The cheap lane costs you resolution, and you find that out before paying.',
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Bring your own keys and infrastructure.** Self-hosted against your own Gemini and fal.ai accounts. `MARKUP_PCT = 0` — and the constant survives rather than being deleted, because `generation_costs.markup_pct` is `NOT NULL` and still records the rate applied. Stripe came out entirely; the cost chip stayed, reframed from “what we charge you” to “what your provider account is about to be charged.”",
    },
    { block_kind: "media_slot", slot_description: "Generate-button price chip, macro crop" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Right, the planning panel** — Plan, Ask, Search. Results render inside the panel and drag straight into a prompt or the Inspiration folder. Nothing leaves the window.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Results" },
    {
      block_kind: "callout",
      callout_tint: "blue",
      callout_text: "**I have engineering evidence and no product evidence, and I won’t blur the difference.**",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Real: 252 source files, 28 migrations, 19 working days, and a defect trail from adversarial self-review — including an SSRF guard that classified private addresses by string shape, so the plain cloud-metadata address was blocked and its IPv4-mapped IPv6 form wasn’t. Findings I didn’t fix are written down in the repo, not dropped.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Absent: time-to-first-good-image, cost per usable image, retention, sessions, conversion. Not “not yet measured” — never instrumented. My own PRD pre-authorised this in writing: *“Only falsifiable numbers… If Q5 yields no numbers, product-impact claims stay qualitative and personal.”*",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "What I’d instrument first: **time from project open to first kept image**, the only number that can falsify the parallel-workspace thesis; **spend per kept image by lane**, because batch is half price only if the cheaper output is good enough to keep; and **whether the third workspace gets used**, because if the median session touches two, three was my ergonomics rather than a principle.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Learnings" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Naming a risk is not mitigating it.** A March 2025 memo of mine says a major lab could release text-preserving image models, then concludes fine-tuned models would still win the niche. The register was right, the mitigation was wrong, and I had the wrong lab — I watched OpenAI and Meta while Google shipped it. It needed a trigger and a pre-committed response, not a reassuring sentence.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Pick problems where model progress is a tailwind.** Shutter Labs monetised a capability gap, so every frontier release was an existential threat. Canvas sits above the models and monetises nothing, so every release makes it better. Nano Banana Pro shipping was a new row in a price table instead of a funeral.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**A cheaper lane has to be honest about what it costs you.** Half-price batch sounds free until you notice it’s 1K-only. Encoding that in `getAvailableSizes()` puts the trade-off at decision time — the price-on-the-button principle applied to quality instead of money.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Client-held state the server can’t contradict will always leak.** Every infinite-spinner bug I shipped reduced to that sentence, and it cost a full lifecycle rebuild to learn something that reads as obvious written down.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Solo doesn’t have to mean unreviewed.** Review became a process instead of a person: independent passes over merge candidates, each briefed to find what’s wrong. It caught the SSRF bypass, a per-user ordering race that survived being folded into one statement under READ COMMITTED, and a drag library’s ARIA attributes putting an unnamed button ahead of every image in the tab order. Not the same as a second engineer; much better than nothing.",
    },
  ],
  article_footer_links: [
    { cta_label: "The story before Canvas →", href: "/work/quicsnap-shutter-labs", cta_variant: "primary" },
    { cta_label: "All projects", href: "/projects", cta_variant: "outline" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
