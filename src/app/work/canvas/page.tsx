import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { canvasArticle } from "@/content/case-canvas";

export const metadata: Metadata = {
  title: "Building on the model that killed my startup — Canvas · Ashesh Srivastava",
  description:
    "Canvas: a self-hosted image-generation workspace with three parallel lanes, six models, and the price printed on the button — built on top of frontier models instead of against them.",
};

export default function CanvasCaseStudyPage() {
  return <ArticleLayout article={canvasArticle} />;
}
