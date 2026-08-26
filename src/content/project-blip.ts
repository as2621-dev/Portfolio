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
    "blip turns the day’s news into a feed that finishes. Overnight it scans about 273,000 articles, picks the 30 that match your interests, and turns each into a 55-second audio reel: two AI anchors talk through the story under a karaoke caption. You can ask any reel a question and it answers only from that story’s sources, or admits it can’t. At reel 30 it tells you you’re caught up and stops. Brief to signed iOS binary in nine weeks, solo.",
  article_tags: ["0→1", "LLM evals", "Retrieval tuning", "Unit economics", "Solo iOS ship"],
  article_meta: [
    {
      meta_label: "Role",
      meta_value: "Designed, built, and shipped solo.",
    },
    {
      meta_label: "Timeline",
      meta_value: "27 May to 26 July 2026 — nine weeks, brief to signed iOS binary.",
    },
    {
      meta_label: "Status",
      meta_value:
        "Signed TestFlight binary, run on a real device; App Store submission deliberately deferred. Code: [github.com/as2621-dev/News20](https://github.com/as2621-dev/News20)",
    },
    {
      meta_label: "Tech",
      meta_value:
        "Swift iOS · fastlane · GDELT via BigQuery · Gemini (scripts, verification, embeddings, TTS, posters) · Supabase · lexical + embedding matching · LLM-generated onboarding · eval harness.",
    },
  ],
  article_stats: [
    {
      stat_value: "273K/day",
      stat_label: "articles analysed from the GDELT firehose, at about $0.004 a day in query cost",
    },
    {
      stat_value: "91.7%",
      stat_label:
        "relevance score: direct-niche hit rate, 11 of 12 micro-interests drew a story matching the niche itself, up from 58.3%",
    },
    {
      stat_value: "56/56",
      stat_label: "feed slots shipped fully produced; a reel is only made after a feed selects it",
    },
  ],
  blocks: [
    { block_kind: "act_divider", act_eyebrow: "Act 1", act_title: "The product decision", anchor_id: "act-1" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**What I built.** blip starts from your interests, not the front page. Overnight it takes the interest profile you built in onboarding, synthesises search queries for each niche, sweeps the GDELT global news firehose with them, then scores every candidate story against your profile and keeps only your top 30. Each survivor becomes a vertical reel: a 55-second two-anchor AI audio digest under a karaoke caption, serif words lighting as they’re spoken. You can question any reel by typing or by voice, and it answers only from that story’s own sources. Then the feed stops at 30.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Who it’s for, and why this problem.** Start with me: on any given day I’m curious about ten different things — AI lab updates, AI chip stocks, cricket, Formula 1, space missions — and following them all means bouncing between X, YouTube, Google News, and LinkedIn until checking the news becomes its own chore. blip’s bet is everything I care about in one feed that ends. My own brief names me as the proxy user, so I’ll keep that framing: n=1. The wider bet is the 25–34 commuter who doom-scrolls and feels guilty about it, but I never ran a user interview, so that’s a hypothesis, not a finding.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The competitor isn’t another news app, it’s the scroll reflex, and you beat a reflex with a structure an incumbent can’t copy. So blip ends: 30 slots, a finish line no infinite-feed business can afford to ship. Ruled out on paper: voice-agent onboarding, a RAG layer, Sign-in-with-Apple, the original video renderer.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**How it’s different.** Reading a story almost always leaves you with a follow-on question, and no other news app gives you anywhere to ask it. blip does: from any reel you can open a chat or launch voice mode with an agent that has complete access to that story’s sources, and when the answer isn’t in them it says so in a designed refusal card, because for news, refusing well is a feature.",
    },
    {
      block_kind: "phone_demo",
      demo_id: "blip-reel",
      demo_caption:
        "real artifacts, playable — the reel screen rebuilt around the pipeline's actual outputs: four fully produced stories from the 2026-06-09 briefing's feed, with their generated posters, two-anchor narration audio, and word-timed karaoke captions taken straight from the repo (`assets/m0`, `agents/m0/output`; feed order per the DB-truth snapshot in `.agents/e2e/review-pack-2026-06-09`). Tap the reel to play, and it ends at 30/30, because that is the product. The mic and the ask bar are the live UI; story Q&A itself runs only in the app.",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 2", act_title: "How it’s built", anchor_id: "act-2" },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "Onboarding: four generations to a three-question interview",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Onboarding took four attempts. A hand-authored interest tree died first (“baseball trade” is not a node in anyone’s tree), and two more died on paper. What shipped is a short interview, exactly three layers deep: broad categories, then LLM-generated chips in your own vocabulary, then one specific name per pick, plus an angle question and a hard mute list. The server owns the flow; the model only words the questions.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Each interest is stored twice: in your words for the feed’s headers, and as a slug (`sport.baseball.mlb.trades`) for the machine, weighted so a pick named three levels down starts at 2.5× a root-level tap. In real tests, finishing the interview takes 53 to 89 seconds and 28 taps against a target of 15. I logged that as a problem to fix, not a reason to raise the target.",
    },
    {
      block_kind: "html_embed",
      embed_src: "/proof/blip/interview-onboarding-gen4.html",
      embed_title: "blip Gen-4 onboarding — the shipped three-layer interview, interactive",
      embed_height: 720,
      embed_caption: "a particular clip of the shipped Gen-4 interview.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The pipeline, in plain English" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Overnight, blip sweeps GDELT with one BigQuery query — **~273,000 articles a day for about $0.004**, every user’s search terms at once — rather than the public API’s one request per five seconds and 250 records a call.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "A story must clear a lexical phrase anchor and embedding similarity to enter an interest’s pool, plus coverage by two independent editorial outlets or one authority outlet — twelve copies of one press release count as zero. Survivors are scored per (user, story) as `(Affinity × DepthMatch)·0.5 + Importance·0.45 + Freshness·0.2`, with the importance weight pinned by a regression test, and your top 30 become reels.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Each story is embedded against a vector store of recent story clusters, so day-two coverage joins its running story instead of minting a new one. The feed excludes everything it has ever served you, with no time window, and before production an LLM judge merges the near-duplicates string matching misses.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Every script claim is classified against its source, and unsupported blocks publishing. The Q&A agent skips retrieval — each story’s corpus fits in one ~6K-token prompt, so RAG would only have added retrieval-miss failure modes.",
    },
    {
      block_kind: "chart",
      chart_id: "blip-pipeline",
      chart_caption:
        "the pipeline as it exists in the repo: GDELT in via one BigQuery query (`gdelt_bigquery.py`), Gemini for scripts, verification, embeddings, TTS, and posters, Supabase out (`persist.py`) — the halt-by-default spend ladder (`run_flags.py`) in the middle, and the voice path that deliberately bypasses the worker (`live_token.py`).",
    },
    {
      block_kind: "phone_video",
      video_src: "/proof/blip/qa-demo.mp4",
      video_poster_src: "/proof/blip/qa-demo-poster.jpg",
      video_aria_label:
        "Scripted demo of blip's ask flow on the story “U.S. strikes Iran again as Trump says a deal is ‘close’”: typed Q&A with a grounded answer, voice mode with spoken question and answer, then the full-article view.",
      video_caption:
        "the ask flow, end to end — reel → typed question → grounded answer → voice mode → the full article. A scripted re-enactment rendered from the app’s own stylesheet, screens, and fixtures: the questions and the grounded answer are the app’s verbatim copy from the 2026-06-09 run. The two voices in the voice beat are generated with the same Gemini TTS the pipeline uses; the agent speaks in Charon, the live agent’s actual voice. Tap to play with sound.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "What broke, and how I fixed it",
      anchor_id: "eval",
    },
    {
      block_kind: "paragraph",
      paragraph_text: "Building solo means every bug lands on my desk. Two that mattered, and how I ran each one down.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The feed was missing its niches — 58.3% → 91.7%.** blip’s riskiest claim is that your niche sections contain your niche, so I measured it: only **7 of 12** micro-interests drew a directly matching story. The obvious conclusion was that I needed a better ranker. Instead I read every failing query and found the pattern: the misses ran on generic phrases (“foundation models”), the hits on named entities (“GPT-4, Claude, OpenAI”) — and nobody writes a headline about foundation models. Rewriting query synthesis to emit named entities took it to **11 of 12 — 91.7%, +33.4 points**. The one regression, an IPL query pulling in the International *Criminal* Court, I logged instead of quietly re-tuning mid-measurement.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Voice mode answered with dead air.** It worked in a demo and failed as an experience: every question sat in seconds of silence, because the live audio model was forbidden to answer and sent each one to the server for two, sometimes three, sequential model calls. Tracing the request path showed the latency was the architecture, not the model: each story’s sources fit in about 6K tokens, so I moved the whole story into the voice session’s context, where it now answers in under a second and stays grounded because that context is all it has. Only questions the story can’t answer still make the server trip, masked by a spoken “let me check that.” The one cost — the server’s second verification pass — went into the docs as a deliberate trade, not a surprise.",
    },
    // The “All caught up” finish line at 30/30 is live in the Act-1 phone demo —
    // play through the four reels (or skip with the chevrons) to reach it.

    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
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
