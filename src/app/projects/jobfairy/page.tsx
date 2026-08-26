import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { jobfairyArticle } from "@/content/project-jobfairy";

export const metadata: Metadata = {
  title: "JobFairy — a job-search copilot with agent research, tailored resumes, and outreach · Ashesh Srivastava",
  description:
    "A job-search copilot for any candidate: filters including a verified H-1B sponsor filter over 31,926 companies, agent research on every role, in-place resume tailoring, agent-filled applications, and personalized outreach through Instantly and Waalaxy.",
};

export default function JobfairyProjectPage() {
  return <ArticleLayout article={jobfairyArticle} />;
}
