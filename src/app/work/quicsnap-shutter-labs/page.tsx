import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { quicsnapShutterArticle } from "@/content/case-quicsnap-shutter";

export const metadata: Metadata = {
  title: "Betting against the models — and losing well · Ashesh Srivastava",
  description:
    "QuicSnap → Shutter Labs, 2022–2025: an AI product-photography company built twice — a service with real revenue, then a platform — until one Google model release absorbed the category.",
};

export default function QuicsnapShutterCaseStudyPage() {
  return <ArticleLayout article={quicsnapShutterArticle} />;
}
