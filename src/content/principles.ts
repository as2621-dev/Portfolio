/**
 * "Principles of building" — the five-gate checklist on the home page.
 * Origin (2026-08-05, owner-directed): Canvas started as a huge requirement
 * doc and Ash got lost inside it; these are the gates every build runs
 * through now, in order. The frame follows the five-step algorithm made
 * famous at SpaceX, retold through Ash's own scar tissue — agentic-coding
 * framing on step 1 and the automate-last warning on step 5 are the personal
 * additions. Rendered by src/components/sections/PrinciplesSection.tsx.
 */

export interface BuildingPrinciple {
  /** 1-based order — the gates only work run in sequence. */
  principle_number: number;
  /** Short imperative title, e.g. "Delete the part or the process". */
  principle_title: string;
  /** One-to-three sentence elaboration in first person. */
  principle_body: string;
}

export const PRINCIPLES_INTRO =
  "Canvas taught me this the hard way: I started with a huge requirement doc and got lost inside it. Now every build runs through five gates, in order — each one only makes sense after the one before it.";

export const BUILDING_PRINCIPLES: BuildingPrinciple[] = [
  {
    principle_number: 1,
    principle_title: "Make the requirement less dumb",
    principle_body:
      "Question every assumption, especially the ones that arrive looking obvious. With agentic coding, this is where 80% of the time should go — building is cheap now; deciding what to build isn't.",
  },
  {
    principle_number: 2,
    principle_title: "Delete the part or the process",
    principle_body:
      "“Just in case” features and tail-end scope get deleted, not deferred. If you never end up adding anything back, you weren't deleting enough.",
  },
  {
    principle_number: 3,
    principle_title: "Simplify and optimize",
    principle_body:
      "Simplifying and optimizing takes the most energy. It feels exciting to save run time or compute time, but if you do it on the wrong workflow, all that effort is wasted.",
  },
  {
    principle_number: 4,
    principle_title: "Accelerate cycle time",
    principle_body:
      "Once the loop is right, run it faster. Keep tightening every pass until things start breaking, then back off one notch.",
  },
  {
    principle_number: 5,
    principle_title: "Automate — last",
    principle_body:
      "Automation freezes whatever it touches, so it comes after everything above has survived. Then take yourself out of the loop — a script, a cron job, an agent. Automate too early and you're just shipping the mistakes on a schedule.",
  },
];
