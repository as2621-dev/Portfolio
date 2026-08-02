import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { orbitArticle } from "@/content/project-orbit";

export const metadata: Metadata = {
  title: "Orbit — a personal feed ranker for 804 sources · Ashesh Srivastava",
  description:
    "A local-first CLI that reads 804 YouTube and X sources, classifies on two independent axes, and emails one 7am digest — surfacing the ~3% worth reading.",
};

export default function OrbitProjectPage() {
  return <ArticleLayout article={orbitArticle} />;
}
