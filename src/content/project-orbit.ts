import type { LongformArticle } from "./longform-types";

/**
 * Project page — Orbit, the personal feed ranker.
 * Source of truth: ~/"Portfolio "/copy/05-project-orbit.md.
 * The digest archive repo is private and must never be linked.
 */
export const orbitArticle: LongformArticle = {
  article_title: "Orbit — reads my 804 sources and hands me one ranked digest at 7am",
  article_subtitle:
    "Orbit reads everything new from my YouTube subscriptions and X follows, ranks each item on two independent axes, and emails me one browsable digest at 7am — so I focus on what actually matters. Every video gets a timestamped summary: click a moment to jump straight into it. And when there’s no time to read at all, one tap on the digest’s Ask Claude button turns the whole morning into a voice conversation.",
  article_tags: ["0→1", "Solo build", "Agentic architecture", "Live daily"],
  article_meta: [
    {
      meta_label: "Role",
      meta_value: "Designed, built, and shipped solo.",
    },
    {
      meta_label: "Timeline",
      meta_value: "June 2026 — present. First commit 18 Jun 2026; delivering daily since.",
    },
    {
      meta_label: "Status",
      meta_value:
        "Live — a launchd agent runs it at 7am every morning. Open source: [github.com/as2621-dev/orbit](https://github.com/as2621-dev/orbit)",
    },
    {
      meta_label: "Tech",
      meta_value:
        "Claude agents (`claude -p` pipeline) · adversarial 3-lens review · LLM classification · two-axis ranking · RAG · transcription (yt-dlp) · voice-mode handoff · Python · SQLite · local-first launchd job · HTML email.",
    },
  ],
  article_stats: [
    { stat_value: "804", stat_label: "sources tracked — 590 YouTube, 214 X" },
    { stat_value: "38", stat_label: "items in a median digest — from the ~25 creators who shipped that day" },
    { stat_value: "65%", stat_label: "of X posts dropped as noise — a YouTube video is never dropped, only demoted" },
  ],
  blocks: [
    { block_kind: "act_divider", act_eyebrow: "Act 1", act_title: "The product decision", anchor_id: "act-1" },
    { block_kind: "heading", heading_level: 3, heading_text: "What I built" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Orbit delta-fetches new items from the feeds I already follow, classifies each on signal-vs-noise and on-topic-vs-off-topic, ranks it, and renders one HTML page delivered by email. It runs entirely on my local machine — browser-cookie auth, local SQLite, a launchd agent at 07:00, no server.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Reading it is the point. Every video arrives as a summary with timestamped section bullets — click one and land on that exact moment in the video, so I listen to the part that matters and skip the rest. And when reading isn’t an option at all, one tap opens a Claude session that pulls the digest straight out of the email — per-video summaries written from the full transcripts, X posts in full — so I can talk through today’s items in voice mode.",
    },
    {
      block_kind: "html_embed",
      embed_src: "/proof/orbit/digest-ledger-2026-08-03.html",
      embed_title: "Orbit daily digest — the Final ledger, real pipeline output",
      embed_height: 720,
      // Reason: the ledger's masthead flex row collides below 860px (measured
      // with headless-Chrome screenshots); the capture is verbatim, so narrow
      // screens get the scaled-down desktop render instead.
      embed_min_content_width: 860,
      embed_caption:
        "real output — the web ledger for Mon 3 Aug 2026, byte-for-byte as the pipeline rendered it on 2 Aug: 36 items from 23 of 806 tracked sources (the 804 above is an earlier snapshot of a moving list). The email body is this ledger re-rendered email-safe; this page rides attached. Scroll it.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The second mode: don’t read it, talk it through" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The brick-red button at the top of the ledger — **ASK CLAUDE ABOUT ALL 28 VIDEOS & 8 POSTS** — is that second mode. One tap opens a Claude session pre-loaded with a handoff prompt: Claude pulls the digest email over Gmail, reads the markdown body, replies that it’s ready, and I switch to voice mode. The whole morning’s feed becomes a conversation — for the commute, the walk, the stretch of day where reading was never going to happen.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The button is the fast path, not the only one. The same email carries the artifacts themselves — `transcripts.md`, every video’s full transcript, plus the ledger page — so the handoff also works by hand: attach both to a fresh Claude session and send.",
    },
    {
      block_kind: "image",
      image_src: "/proof/orbit/voice-handoff-composer-2026-08-05.png",
      image_alt:
        "Claude app composer loaded with transcripts.md and today-ledger.html attached as files, the Orbit handoff prompt pasted in full, model set to Opus 5 on high reasoning, send button ready.",
      image_caption:
        "real capture — the manual handoff, loaded: transcripts.md and today-ledger.html attached, the shipped prompt pasted verbatim, Opus 5 on high. One tap left.",
    },
    {
      block_kind: "image",
      image_src: "/proof/orbit/voice-handoff-session-2026-08-05.png",
      image_alt:
        "A live Claude session after sending the handoff: the two attachments and the prompt sit at the top, a status line reads “Used Gmail integration, loaded tools, read a memory”, and Claude’s streaming reply says it read the 3 Aug digest — noting the newer_than:2d query came back empty so it used the most recent Orbit email — before stopping mid-sentence at “ready when you”.",
      image_caption:
        "real capture — after send: Gmail integration pulls the digest email, and when the `newer_than:2d` window has rolled past, Claude says so and falls back to the most recent Orbit digest. The reply ends at “ready when you…” — the session opens at my first question, exactly as instructed.",
    },
    {
      block_kind: "media_slot",
      slot_description:
        "GIF, real capture only — the motion version of the stills above: Claude app composer with transcripts.md and today-ledger.html attached and the handoff prompt pasted → tap send → Claude’s one ready line → voice mode on, first question asked aloud. Record the shipped flow on device; never hand-author.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Who it’s for" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "It started with wanting to seriously follow AI. I subscribed to everyone worth hearing — 590 YouTube channels, 214 X accounts — and then couldn’t keep up: too much, every day, all at once. I didn’t want fewer sources, I wanted fewer *openings*. So I built the thing that reads my whole orbit every morning, hands me one ranked summary of everything that moved, and lets me talk it through when there’s no time to read.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Built for me, and honestly so — one user I understand completely is the fastest way to get the judgment calls right. But the shape is anybody’s: busy, and trying to actually follow something — AI, markets, a sport, a scene — same problem, different nouns. Every layer is per-user from the first commit, so a second user is a config change.",
    },
    { block_kind: "act_divider", act_eyebrow: "Act 2", act_title: "How it’s built", anchor_id: "act-2" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Architecture.** A Python CLI driving a staged pipeline, with SQLite as the only state. YouTube comes in through `yt-dlp`; X through a vendored cookie-auth GraphQL client. X rotates the query IDs behind that API, so the client re-resolves them live from the site’s own JS bundle — when X shuffles them, Orbit keeps working.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Cookies, not passwords.** Orbit never logs in to the accounts it reads and holds no credential for them — no password in any config, no OAuth app, no third-party service with access to my accounts. I’m already signed in to YouTube and X in my browser, and Orbit borrows that session. On the YouTube side, `yt-dlp` — the open-source downloader that fetches the videos — reads the browser’s cookie store straight off disk via `--cookies-from-browser`, so its requests carry my existing login and YouTube serves my subscriptions feed as if I’d opened the tab myself. The X client does the same one layer down: it presents the session cookies the X web app itself runs on, to the same GraphQL endpoints the site calls.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Nothing is typed and nothing is copied into a config: cookies are read fresh at each run, held in memory, and sent nowhere except the two platforms they already belong to. The one secret Orbit does keep is on the sending side — a Gmail app password in a gitignored `.env`, scoped to mail rather than the whole Google account and revocable on its own, used only to email me the digest. And the setup doc refuses to dress any of this up: it states that an auth token is full account access, in a section headed “do not soften.”",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The run.** Load sources → fetch YouTube: transcribe, chapterize, classify → fetch and classify X → cluster for trending → rank and tier → summarise → render → deliver → archive. Every stage fails soft in a specified direction — and delivery deliberately runs before the archive push, so a failed push can never cost me the morning email.",
    },
    {
      block_kind: "chart",
      chart_id: "orbit-pipeline",
      chart_caption:
        "the run as it executes in scripts/orbit.py — solid lanes are the pipeline stages; dashed strokes are the injected boundaries (claude -p, keyless web search, SQLite, the gh archive push), each specified to fail soft.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "What happens to each item" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Classification.** Every item that survives the delta fetch gets two independent verdicts — 2,028 items judged in the first 42 days. *Signal vs noise:* is there a real claim here, or is it shorts bait, promo, platitudes, a hot take with nothing specific? *On-topic vs off-topic:* is this what I follow the source *for*? Two axes instead of one relevance score, because the axes **disagree on 333 items (16.4%)** — a sharp video on the wrong topic and a lazy video on the right one both land mid-scale on any single number, so a sixth of my feed would be misfiled.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The same noise verdict then lands differently by platform, on purpose. It deletes an X post outright — a tweet costs nothing to lose, and 65% of them go this way — but it only *demotes* a YouTube video into the “they also posted” strip at the bottom of the digest. A channel I chose deserves a line even on an off day; deleting its video would be the digest silently second-guessing my subscriptions.",
    },
    {
      block_kind: "chart",
      chart_id: "orbit-triage",
      chart_caption:
        "one item's path through the judge. The gray, dashed routes are the only deletions — Shorts, off-taxonomy items, X posts judged noise; everything else ships, full-slot or demoted.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Measuring quality.** The test suite measures correctness, not quality. The real work came from per-item score components in structured logs, a three-lens adversarial review that produced 17 “what I deliberately did *not* fix, and why” write-ups, and an audit that caught the product drifting from its own spec. The gap: 20 user stories, zero target metrics, no precision bar.",
    },
    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Following the process proved most of my feed is fluff.** About 75% of what I follow is dead — in 42 days only 97 of 214 X accounts and 104 of 590 YouTube channels produced a single item — and even inside the videos that do ship, the genuinely new moments are maybe 5% of the runtime. The rest is intros, recaps, sponsor reads, takes with nothing specific in them. No platform will surface either number — a follow count is a number they want going up. Ranked summaries with timestamped jumps collapse hours of watching into minutes of reading; that returned time is the product.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The world runs on APIs — even where none is offered.** Every site is a frontend over an API its own pages call. Orbit never scrapes HTML: it borrows the sessions already in my browser, so YouTube serves my subscriptions feed and X answers the same GraphQL endpoints its web app runs on. The constraint I’d filed as a tax — cookies can’t leave the machine, so this must run locally — turned out to be the moat: it’s why no hosted product can read a feed this way. And the insight compounded: three days after Orbit’s first commit, I pointed the same move at my [electricity smart meter](/projects/astrape) — a CLI that signs in the way the portal itself does and calls the API its frontend calls. No email round-trip, no scraping.",
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
