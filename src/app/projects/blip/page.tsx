import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { blipArticle } from "@/content/project-blip";

export const metadata: Metadata = {
  title: "blip — the news app that ends · Ashesh Srivastava",
  description:
    "News as vertical reels: an iOS app with karaoke captions over generated narration, a feed that stops at 30 — and the week of tuning that took niche hit rate from 58.3% to 91.7%.",
};

export default function BlipProjectPage() {
  return <ArticleLayout article={blipArticle} />;
}
