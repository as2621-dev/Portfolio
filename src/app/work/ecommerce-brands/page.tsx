import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { ecommerceBrandsArticle } from "@/content/case-ecommerce-brands";

export const metadata: Metadata = {
  title: "A Baby Cherry & Decor & More — two ecommerce brands · Ash Sri",
  description:
    "The founder-era origin story: two private-label consumer brands — sourced from factories in China, Vietnam, and India, trademarked, listed, priced, and returned. Where the unit-economics reflex comes from.",
};

export default function EcommerceBrandsPage() {
  return <ArticleLayout article={ecommerceBrandsArticle} />;
}
