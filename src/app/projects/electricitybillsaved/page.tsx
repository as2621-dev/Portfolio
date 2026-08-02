import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { electricityBillSavedArticle } from "@/content/project-electricitybillsaved";

export const metadata: Metadata = {
  title: "ElectricityBillSaved — modeling a $129 pricing cliff to within 17 cents · Ashesh Srivastava",
  description:
    "A usage model for a Texas bill-credit electricity plan, validated against a real bill to $0.17 — and a 999 vs 1,000 kWh paradox worth the read.",
};

export default function ElectricityBillSavedProjectPage() {
  return <ArticleLayout article={electricityBillSavedArticle} />;
}
