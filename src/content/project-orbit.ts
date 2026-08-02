import type { LongformArticle } from "./longform-types";

/**
 * Project page — Orbit, the personal feed ranker.
 * Source of truth: ~/"Portfolio "/copy/05-project-orbit.md.
 * The digest archive repo is private and must never be linked.
 */
export const orbitArticle: LongformArticle = {
  article_eyebrow: "Project · Agents & tools",
  article_title: "I follow 804 sources. Orbit reads all of them and hands me the 3%.",
  article_subtitle:
    "A local-first CLI that pulls what’s new from my own YouTube subscriptions and X following, judges each item on two independent axes, ranks what survives, and emails me one browsable digest at 7am.",
  article_tags: ["Ranking", "CLI", "SQLite"],
  article_meta: [
    {
      meta_label: "Role",
      meta_value: "Designed, built, and shipped solo. [SLOT: GitHub link — CONFIRM repo is public before linking]",
    },
  ],
  article_stats: [
    { stat_value: "804", stat_label: "sources tracked — 590 YouTube, 214 X" },
    { stat_value: "3,764", stat_label: "items ingested in 42 days" },
    { stat_value: "~3%", stat_label: "surfaced — median digest of 38 items from ~25 active creators" },
  ],
  blocks: [
    { block_kind: "act_divider", act_eyebrow: "Act 1", act_title: "The product decision", anchor_id: "act-1" },
    { block_kind: "heading", heading_level: 3, heading_text: "What I built" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Orbit delta-fetches new items from the feeds I already follow, classifies each on signal-vs-noise and on-topic-vs-off-topic, ranks it, and renders one HTML page delivered by email. It runs entirely on my laptop — browser-cookie auth, local SQLite, a launchd agent at 07:00, no server.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Who it’s for" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Me, and I won’t dress that up. I follow 590 YouTube channels and 214 X accounts — a self-inflicted problem with a specific shape: I don’t want fewer sources, I want fewer *openings*. Building for one user I understand completely is the fastest way to get the judgment calls right. Every layer is per-user from the first commit, so a second user is a config change.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Why this problem, and what I ruled out" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The spec uses one convention throughout: *decision → rationale →* **Rules out:**. Naming what a choice forecloses is what makes it a decision instead of a preference.",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Filtering, not discovery.** No adjacent-creator suggestions — ruled out twice, because it’s the feature that quietly turns a curation tool back into a feed.",
        "**One delivery path.** Orbit shipped over iMessage first: worked on one Mac, only if it was awake. Moving to email, I *deleted* iMessage and WhatsApp rather than deprecating them.",
        "**Local over cloud.** Re-examined once and re-rejected, for a structural reason: a cloud scheduler cannot read my browser cookies.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "*Why not Feedly or Readwise Reader?* Both beat me on RSS and saved articles, but neither can see what Orbit sees — reading my subscriptions requires being logged in *as me*, and no hosted service can hold that session. [CONFIRM: new reasoning for this page; in no original spec]",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Outcome, and what I still can’t prove" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The database is real: 804 sources, 3,764 items seen, 2,028 classified over 42 days. About **36% of everything ingested** is filtered out of the main digest — measured, not modelled.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "What I can’t tell you is whether the ranking is *right*. No open-rate, no clicks, no read-time. `carryforward` — the “did this get read?” mechanism — has 0 rows: it exists in the store and was never wired into the render, and I filed that as a known gap rather than hiding it. **0 of 2,028** classifications carry a user override, which is either “the classifier was good enough” or “the correction affordance is undiscoverable” — my data can’t distinguish. Runs: 11 started, **10 completed**, one zero-item digest nobody has explained.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Next: hand-score a week of digests against what I actually opened, for a precision number the system has no bar for, then wire carryforward so a twice-skipped item stops competing with today’s news.",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 2", act_title: "How it’s built", anchor_id: "act-2" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Architecture.** A Python CLI (19,882 lines, 39 modules, 464 tests) driving a staged pipeline, with SQLite as the only state. YouTube via `yt-dlp --cookies-from-browser`; X via a vendored cookie-auth GraphQL client that resolves X’s rotating query IDs live from the site bundle. Cookies are read at runtime only and never transmitted — and the setup doc says plainly that an auth token is full account access, in a section headed “do not soften.”",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The run.** Load sources → fetch and classify X → fetch YouTube, transcribe, chapterize → cluster for trending → rank and tier → summarise → render → archive → deliver. Every stage fails soft in a specified direction.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Classification.** 2,028 items judged on two orthogonal binary axes — signal vs noise (shorts bait, promo, platitudes, hot takes with no specific claim) and on-topic vs off-topic. The axes **disagree on 333 items (16.4%)**, which is the empirical answer to “why not one relevance score”: a sixth of my feed is misfiled by any single number.",
    },
    {
      block_kind: "media_slot",
      slot_description: "rendered digest — needs a crop and a check that no source handles are legible",
    },
    { block_kind: "paragraph", paragraph_text: "**Ranking.** Every constant carries its argument in the source:" },
    {
      block_kind: "table",
      table_header: ["Constant", "Value", "Why"],
      table_rows: [
        [
          "`RELATIVE_ENGAGEMENT_WEIGHT`",
          "1.0",
          "Scored against the creator’s *own* baseline — a small channel’s breakout beats a big channel’s routine upload.",
        ],
        ["`UNIQUENESS_BASELINE_BOOST`", "1.0", "A floor, so a lone sharp take never sinks below a crowded topic."],
        ["`QUOTE_TWEET_MULTIPLIER`", "0.5", "A quote is derivative, so it ranks below an identical original."],
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The invariant: **rank controls density, never inclusion.** Every item gets a tier (hero 10%, standard 25%, compact 35%, rest to an index band) and nothing is dropped — things shrink, they don’t disappear. A UX principle enforced as a test: output length must equal input length. One scoped exception: an unbounded X feed drowns a digest in a way YouTube doesn’t, so for X only, inclusion is capped at 8.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Measuring quality.** 464 tests measure correctness, not quality. The real work came from per-item score components in structured logs, a three-lens adversarial review that produced 17 “what I deliberately did *not* fix, and why” write-ups, and an audit that caught the product drifting from its own spec. The gap: 20 user stories, zero target metrics, no precision bar.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "The reversal: I ruled out an HTML email body, then un-ruled it",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The original ruling was categorical — **summary body, never inline HTML** — and the reasoning was sound: Gmail clips bodies near 102KB and is hostile to grid, flex, webfonts, and base64 images. So: text in the body, rich page attached.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Then I used it for a week and found I was opening an email in order to open a *second* thing. The body was where the product lived, and I’d optimised it away.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "I superseded the ruling in place — struck through and dated in the PRD, not quietly rewritten. The error wasn’t the constraint, it was the inference: right that the full-fidelity page can’t survive Gmail, wrong to conclude the body must therefore be text. A second, purpose-built render — classed CSS, remote images, no webfonts, under the clip budget — makes the body readable where it arrives. And I settled it empirically rather than by argument: a live probe established the clip applies to *decoded* bytes, which is what made the budget achievable at all.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**About 75% of what I follow is dead.** In 42 days only 97 of 214 X accounts and 104 of 590 YouTube channels produced a single item. I’d been carrying ~600 dormant follows and experiencing them as clutter. No platform will tell you this — a follow count is a number they want going up. The ranker ended up auditing its own inputs.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**A constraint I’d filed as a limitation was the moat.** “Must run locally because cookies can’t leave the machine” sat in my spec as a tax for months. I only saw it was the reason the product can exist when I tried to write down why nobody else had built this.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Shipping the affordance is not shipping the loop.** Overrides, creator weights, carryforward — built, and all three inert in production. Building the mechanism felt like progress and produced zero rows of data. Measurement needed its own milestone and acceptance bar, not a by-product of the features that enable it.",
    },
  ],
  article_footer_links: [
    { cta_label: "All projects →", href: "/projects", cta_variant: "primary" },
    { cta_label: "The flagship story", href: "/work/quicsnap-shutter-labs", cta_variant: "outline" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
