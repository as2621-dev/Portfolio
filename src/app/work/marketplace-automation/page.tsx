import type { Metadata } from "next";
import { ArticleLayout } from "@/components/longform/ArticleLayout";
import { marketplaceAutomationArticle } from "@/content/case-marketplace-automation";

export const metadata: Metadata = {
  title: "QEG Automation — the machine that ran 77 storefronts · Ash Sri",
  description:
    "QEG Automation — US Walmart marketplace stores run on a custom-built platform and a ~35-person ops team: $593K peak monthly GMV, 204,559 live listings, and the fourteen-cron pipeline mapped end to end.",
};

export default function MarketplaceAutomationPage() {
  return <ArticleLayout article={marketplaceAutomationArticle} />;
}
