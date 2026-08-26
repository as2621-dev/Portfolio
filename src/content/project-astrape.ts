import type { LongformArticle } from "./longform-types";

/**
 * Project page — Astrape, the Texas bill-credit usage model.
 * Source of truth: ~/"Portfolio "/copy/08-project-astrape.md.
 * Repo linked 2026-08-09: github.com/as2621-dev/Astrape is now
 * public (the copy's PII-scrub gate is assumed cleared by the owner making it
 * public — unlink if the scrub is not actually done).
 */
export const astrapeArticle: LongformArticle = {
  article_eyebrow: "Project · Agents & tools",
  article_title: "Astrape — forecasts whether my month crosses 1,000 kWh, where my bill drops from $207 to $78",
  article_subtitle:
    "My Texas provider sells a bill-credit plan: use 1,000 kWh or more in a billing cycle and $125 comes off the bill, which means a month of 999 kWh costs $207 while 1,000 kWh costs $78. My problem was that I could never tell which side of that line a cycle would land on, because daily usage swings hard with the weather. So I built a tool that forecasts each cycle against the 1,000 kWh mark, and checked its math against a real bill to within seventeen cents. Around half a million Texas households are on plans like this one, so there may be a real market hiding in it too.",
  article_tags: ["Forecasting", "Bill-validated", "No LLM by design", "Solo build"],
  article_meta: [
    {
      meta_label: "Role",
      meta_value: "Designed, built, and shipped solo.",
    },
    {
      meta_label: "Timeline",
      meta_value: "May to June 2026 — one cooling season in Houston; last commit 14 Jun 2026.",
    },
    {
      meta_label: "Status",
      meta_value:
        "Model validated to $0.17 against a real bill. Open-sourced: [github.com/as2621-dev/Astrape](https://github.com/as2621-dev/Astrape)",
    },
    {
      meta_label: "Tech",
      meta_value:
        "Python · cooling-degree-day regression · Smart Meter Texas 15-minute interval data · Open-Meteo weather · Apps Script dashboard · bill reconciliation to a $1 tolerance.",
    },
  ],
  blocks: [
    { block_kind: "act_divider", act_eyebrow: "Act 1", act_title: "The product decision", anchor_id: "act-1" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**What I built.** A projection tool, named Astrape after the Greek goddess of lightning. It pulls Smart Meter Texas’s 15-minute interval data from a daily email, pairs each day with free Open-Meteo weather, fits a cooling-degree-day regression, and answers one question: will this cycle clear 1,000 kWh?",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Who it’s for.** I built it for myself, to run against my own meter and my own plan through a single cooling season in Houston. But I got curious whether anyone else would want it, so I ran the numbers. Texas has about 11 million households. Roughly 1.9 million of them have a smart thermostat, about 1.33 million of those are on Smart Meter Texas, and around 530K are on a bill-credit plan. Of those, maybe 250–350K live close enough to a threshold that a forecast would actually change what they pay. The 530K is the shakiest number in that chain — it rests on meter counts I couldn’t verify, so I’d call it low-medium confidence, give or take 15 points.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Why this problem.** The $125 credit exists because of how Texas makes people shop for electricity. Every plan has to publish its average price at three usage levels (500, 1,000, and 2,000 kWh), and shoppers compare plans on the 1,000 kWh price. A credit that kicks in right at 1,000 kWh makes that one advertised number look very cheap, so the plan wins the comparison — but the cheap price is only real if you actually reach 1,000. Land at 999 and the credit vanishes, and that is where the provider makes its money. It also means normal “save energy” advice backfires on a plan like this: near the cliff one extra kWh costs about $5 and unlocks about $100, so at 970 kWh the smart move is to *turn the AC down*.",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 2", act_title: "How it’s built", anchor_id: "act-2" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The model.** The logic is simple. Every home burns a fixed amount of electricity a day no matter the weather — fridge, router, lights. That’s the baseload. On hot days the AC adds more, roughly in proportion to how far the day’s average temperature climbs above 65°F. So to project the cycle, the tool learns two numbers from the days already metered — the baseload, and how many extra kWh each degree above 65 costs — then applies them to the weather forecast for the days remaining. In math, it’s ordinary least squares, hand-rolled in about 24 lines, no numpy:",
    },
    {
      block_kind: "code",
      code_text: "kWh/day ≈ baseload + β · CDD65      where CDD65 = max(0, daily mean °F − 65)",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "It fits only on days with both metered usage *and* observed weather; the rest of the cycle is forecast ahead, reanalysis behind.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**How I validated it — against money, not against itself.** The bill module recomputes each bill from metered usage and the plan’s published terms, then reconciles it against the billing email to a $1 tolerance. On the 2026-05-13 bill — billed $91.65 — the model computed $91.82.",
    },
    {
      block_kind: "chart",
      chart_id: "astrape-pipeline",
      chart_caption:
        "the pipeline as it actually runs, from source — `Gmail.gs` → `Weather.gs` → `Projection.gs` into one Google Sheet, `reconcile_4change_bill.py` checking the math against real bills, the thermostat client verified but never wired in. no LLM anywhere in the loop, by design.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The dashboard.** Dark, mobile-first, one screen, no scrolling: cumulative kWh in solid green, projection dotted, a dashed red line at 1,000.",
    },
    {
      block_kind: "html_embed",
      embed_src: "/proof/astrape/dashboard-live-snapshot.html",
      embed_title: "Astrape dashboard — static snapshot of the live Apps Script web app",
      embed_height: 560,
      embed_caption:
        "real product — the deployed Apps Script dashboard, captured 2026-08-02 as a static DOM snapshot (scripts stripped, chart frozen from the live canvas). June cycle view.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Where this goes next" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The plan is to close the loop.** Today the tool only watches; the next step is to let it drive my thermostat. The projection already knows, days in advance, which side of 1,000 kWh a cycle will land on, so it can turn that into a concrete suggestion — you’re pacing toward 965 kWh, run the AC one degree cooler for the next few days and you’ll clear the minimum — and eventually make that adjustment itself.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The thermostat half already works, and it took a workaround.** My thermostat is an Aprilaire, and Aprilaire publishes no developer API. But its phone app has to talk to something, so my client talks to the same aprilaire.io cloud the app does: it authenticates through the app’s own AWS Cognito pool, reads setpoints over REST and live temperature over a WebSocket, and writes a new setpoint with a PATCH. Read and write are both verified against the live unit. And Aprilaire is the hard case — Nest, Ecobee, and Honeywell all publish official APIs, so for most of the market the thermostat link is the easy part.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Everything is an API.** The thermostat workaround above is the proof: Aprilaire publishes no API, but its own phone app was riding one all along. Since this project, I check for the API first, everywhere — most “there’s no way to get the data” problems are really “nobody opened the network tab” problems.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Electric companies are playing a game, and now I can see it.** I learned more about billing technicalities than I ever planned to — delivery charges, energy charges, how a bill-credit plan actually computes. And once you understand the mechanics, the design is hard to unsee: these plans are built around most customers missing the credit. It is in the provider’s best interest that you never hit 1,000 kWh. The $125 credit is the advertisement; the customer who lands at 970 is the margin.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Smart meters are amazing, and almost nobody uses them.** Every home on Smart Meter Texas is already recording usage in 15-minute intervals, with on-demand reads available through a public platform. All the data this project needed was sitting there, free. The infrastructure is years ahead of the products built on top of it.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**There might be a business in here one day.** Precisely because it’s in the provider’s interest that you miss the threshold, the provider will never build this tool — a tracker that helps you hit 1,000 kWh can only come from a third party. I haven’t commercialized any of this, and the market sizing above is honest about how Texas-shaped it is. But it’s the rare side project where the incentives point at a real product: the users’ interest and the provider’s are directly opposed, and the data to serve the users is already public.",
    },
  ],
  article_footer_links: [
    { cta_label: "All projects →", href: "/projects", cta_variant: "primary" },
    { cta_label: "The flagship story", href: "/work/quicsnap-shutter-labs", cta_variant: "outline" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
