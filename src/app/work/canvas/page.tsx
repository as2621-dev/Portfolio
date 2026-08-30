import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { canvasArticle } from "@/content/case-canvas";

export const metadata: Metadata = {
  title: "Canvas — an IDE for image generation · Ash Sri",
  description:
    "Why I stopped generating images in a chat box and built a three-panel workspace instead: parallel workspaces, research beside the prompt, and the price on the button before every run.",
};

export default function CanvasCaseStudyPage() {
  return <ArticleLayout article={canvasArticle} />;
}
