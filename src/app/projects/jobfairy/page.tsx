import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { jobfairyArticle } from "@/content/project-jobfairy";

export const metadata: Metadata = {
  title: "JobFairy — one application, two browser agents, $1.15 · Ashesh Srivastava",
  description:
    "A job-search copilot over 31,926 verified H-1B sponsor companies — and a head-to-head browser-agent bake-off with real cost, latency, and reliability data.",
};

export default function JobfairyProjectPage() {
  return <ArticleLayout article={jobfairyArticle} />;
}
