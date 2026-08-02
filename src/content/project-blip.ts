import type { LongformArticle } from "./longform-types";

/**
 * Project page — blip, news as vertical reels.
 * Source of truth: ~/"Portfolio "/copy/06-project-blip.md.
 * Numbers deliberately dropped in verification (pipeline funnel, first armed
 * run) stay out — do not reinstate without a primary source.
 */
export const blipArticle: LongformArticle = {
  article_eyebrow: "Project · AI products",
  article_title: "blip — the news app that ends",
  article_subtitle:
    "…and the week of tuning that took its niche hit rate from 58.3% to 91.7%. blip turns the day’s news firehose into ~30 personal 55-second audio reels with karaoke captions, lets you interrogate any story against its own sources, then tells you you’re caught up. Brief to signed iOS binary in nine weeks, solo.",
  article_tags: ["iOS", "LLM pipeline", "Evals"],
  article_meta: [
    {
      meta_label: "Role",
      meta_value:
        "Designed, built, and shipped solo. [SLOT: GitHub link — CONFIRM repo public + add a LICENSE before calling it open source]",
    },
  ],
  article_stats: [
    { stat_value: "58.3% → 91.7%", stat_label: "niche hit rate, before → after a week of tuning" },
    { stat_value: "273K / $0.004", stat_label: "articles scanned a day / that day’s cost" },
    { stat_value: "~92 files", stat_label: "of working code I deleted on the evidence" },
  ],
  blocks: [
    { block_kind: "act_divider", act_eyebrow: "Act 1", act_title: "The product decision", anchor_id: "act-1" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**What I built.** The day’s news as vertical reels — each story a ~55-second two-anchor AI audio digest under a karaoke caption, serif words lighting as they’re spoken. Ask any reel a question and it answers only from that story’s sources. Then the feed stops at 30.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Who it’s for.** My own brief names me as the proxy user, so I’ll keep that framing: n=1. The wider bet is the 25–34 commuter who doom-scrolls and feels guilty about it — but I never ran a user interview, so that’s a hypothesis, not a finding.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Why this problem, what I ruled out.** The competitor isn’t another news app, it’s the scroll reflex — and you beat a reflex with a structure an incumbent can’t copy. So blip ends: 30 slots, a `26/30` counter, a finish line no infinite-feed business can afford to ship. Ruled out on paper: voice-agent onboarding, a RAG layer, Sign-in-with-Apple, the original video renderer.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**How it’s different.** Every reel is a doorway, not a dead-end clip — and when it can’t answer from the source it says so in a designed refusal card, because for news, refusing well is a feature.",
    },
    {
      block_kind: "callout",
      callout_tint: "blue",
      callout_title: "Honest ship status",
      callout_text:
        "Signed, App-Store-provisioned iOS binary built 2026-06-16, distributed via TestFlight and run on a real device; fastlane automates the lanes, build number iterated to 4. App Store submission was deliberately deferred, and the gate I set myself in month one — five digests shown to strangers *before* building the pipeline — I never ran. No external users, no retention data.",
    },
    {
      block_kind: "media_slot",
      slot_description:
        "hero — karaoke caption mid-playback, one yellow keyword lit, segment bar and 07/30 counter visible (requires running the app)",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 2", act_title: "How it’s built", anchor_id: "act-2" },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "The redesign: a cream magazine that couldn’t survive its own product",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The Gen-1 spec mandated a warm cream editorial system — `#f4f1ea` paper, deep green and rust, Fraunces — shipped as a working prototype and declared the source of truth. None of it survived: once the reel went audio-first the caption became the brightest thing on screen, and the shipped system is the inverse — dark only, near-black navy, one yellow accent, serif for the news and mono for the machine.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Onboarding ran three generations: a hand-authored interest tree, then voice-agent onboarding killed on paper, then the one that shipped — an LLM generating the chips live, each tap producing the next more specific set (Sport → Cricket → IPL). No fixed taxonomy holds a real interest; “IPL auction drama” is not a node in anyone’s tree. Measured through the real browser flow: 52.9–88.6 seconds a profile, and 28 taps against a ~15 target — logged as a regression, not rebaselined.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The pipeline, and the AI decisions inside it" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Ingestion reads GDELT, but not through its public API — one request per five seconds per IP, 250 records a call. One BigQuery query over the same public firehose reads **~273,000 articles a day for about $0.004**. A story matches an interest only if it clears both a lexical phrase anchor and embedding similarity, so the zoning lawsuit that genuinely contains “data center” gets rejected. One formula then ranks every (user, story) pair — `(Affinity × DepthMatch)·0.5 + Importance·0.45 + Freshness·0.2` — with the importance weight pinned by a regression test, so tuning is executable rather than tribal.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "In production the gates matter more than the models: every claim in a script is classified against its source, and unsupported blocks publishing. The AI decision I’d defend hardest is the one I didn’t make — no vector DB, since each story’s corpus fits in one ~6K-token prompt and RAG would have added retrieval-miss failure modes for nothing. The voice path drops the second verification pass to buy sub-second answers, because you can’t unspeak an answer: a conscious downgrade, documented rather than discovered.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "The eval that mattered: 58.3% → 91.7%",
      anchor_id: "eval",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The riskiest claim blip makes is that your niche sections contain your niche, so I built an instrument for exactly that — **direct-niche hit rate**: across a user’s micro-interests, what share drew at least one story matching the leaf *directly*, rather than a climb to the parent category? Target ≥60%, over at least three real pull-days.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Day one returned `0/0` — no eligible cells, so the metric wasn’t computable. I recorded the non-result rather than reaching for a number that would have looked better.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Driven through the real browser onboarding with three personas, the pre-tuning read was **7 of 12 niches — 58.3%, a miss.** The diagnosis was the valuable part: every dry niche had a *generic phrase* as its query (“foundation models”); every niche that hit carried *named entities* (“GPT-4, Claude, OpenAI”). News indexes match literal strings in headlines, and nobody writes a headline about foundation models. The fix was query synthesis, not more machine learning: **11 of 12 — 91.7%, +33.4 points.**",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Then the honest half. That same rewrite raised recall and cost precision on ambiguous acronyms — the cricket persona’s IPL section pulled in the International *Criminal* Court. I logged it against my own tuning and did not fix it mid-measurement, because changing the query would have invalidated the before/after I’d just paid for.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The $24 morning" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "On 2026-07-19 one misread environment flag turned a shortlist-only run into a full production run: 58 reels of TTS and posters, $24, none of it wanted. The gate existed — it was guarding the wrong seam. What replaced it is a three-rung ladder where **the default is always halt**, each rung armed separately, so a stale flag in a dashboard can’t buy anything. The economics inverted the same week: select each user’s 30 *before* producing, then produce only what a feed actually selected. [CONFIRM: untraced number — the pre-inversion run reportedly produced 76 reels for one 30-slot user, ~60% waste] Verified later: **0 of 56 feed slots shipped posterless.**",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Deleting six weeks of my own work" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "On 2026-07-07 I audited my own briefing row by row against production data: **5 of 30** reels matched their displayed tag, and **11 of 30** were junk — a venison donation notice, an obscure REIT press release, a source masthead shipped as a headline. The YouTube/X source-follow system I’d spent six weeks on, with 170 hand-curated channels and ~1,055 live-verified handles, produced **zero** reels while its unfilled budgets quietly distorted the allocation the user had explicitly set.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "I removed all of it — about **92 files**, by explicit inventory rather than a path glob, because three name collisions meant a `source`-ish grep would have taken out the story-clustering engine. Correctness fixes shipped first, feed regenerated to prove the jump, *then* the removal. I still believe the thesis behind that feature; it shipped zero measured value on the day I measured it. Those are different sentences.",
    },
    {
      block_kind: "media_slot",
      slot_description: "closing — the “All caught up” finish line at 30/30 (requires running the app)",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**A gate that isn’t armed where money leaves is not a gate.** One halt boolean can’t guard three rungs of spend — $24 was cheap tuition, and the unattended version isn’t.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Retrieval quality is a query-writing problem before it’s a model problem.** The +33-point jump came from swapping generic phrases for named entities; I was one session from concluding I needed a better ranker.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The last mile is a different job.** App Store review, real testers, the stranger test I designed as my own gate: all undone. No amount of pipeline depth substitutes for one person outside the build actually using it.",
    },
  ],
  article_footer_links: [
    { cta_label: "All projects →", href: "/projects", cta_variant: "primary" },
    { cta_label: "The flagship story", href: "/work/quicsnap-shutter-labs", cta_variant: "outline" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
