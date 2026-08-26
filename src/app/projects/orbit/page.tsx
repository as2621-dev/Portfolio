import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { orbitArticle } from "@/content/project-orbit";

export const metadata: Metadata = {
  title: "Orbit — a personal feed ranker for 804 sources · Ashesh Srivastava",
  description:
    "Orbit reads 804 YouTube and X sources, ranks every new item on two independent axes, and emails a 7am digest with timestamped video summaries — jump to the exact moment, or talk it through with Claude in voice mode.",
};

export default function OrbitProjectPage() {
  return <ArticleLayout article={orbitArticle} />;
}
