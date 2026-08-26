import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { quicsnapShutterArticle } from "@/content/case-quicsnap-shutter";

export const metadata: Metadata = {
  title: "QuicSnap → Shutter Labs — AI product photography, racing the model curve · Ashesh Srivastava",
  description:
    "QuicSnap → Shutter Labs, 2023–2024: I built an AI product-photography business to real revenue, then pivoted to a platform ahead of the frontier models — and learned how fast the curve moves.",
};

export default function QuicsnapShutterCaseStudyPage() {
  return <ArticleLayout article={quicsnapShutterArticle} />;
}
