import type { Metadata } from "next";
import { slugConfigs } from "../../lib/categoryConfig";
import CategoryPageClient from "./CategoryPageClient";

const SITE_URL = "https://basmathatify.com";
// Fix 13: إزالة getCompany() من كل category page — كانت تُضيف DB call لكل slug
// siteName ثابت — يمكن تحديثه هنا بدل جلبه من API في كل request
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "لمسه لبيع الشرائح";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = slugConfigs[slug];

  const label = config?.label ?? slug;
  const parentLabel = config?.parentLabel ?? "";

  const title = parentLabel
    ? `${label} - ${parentLabel} | اشتري بالتقسيط من ${SITE_NAME}`
    : `${label} | أفضل الأسعار والتقسيط المريح من ${SITE_NAME}`;
  const description = `تسوق ${label} بأفضل الأسعار وبالتقسيط المريح بدون فوائد في ${SITE_NAME}. ${parentLabel ? `ضمن قسم ${parentLabel}.` : ""} شحن سريع لجميع مناطق المملكة وضمان معتمد على جميع المنتجات.`;

  return {
    title,
    description,
    keywords: [label, parentLabel, SITE_NAME, "أقساط", "شراء", "السعودية"].filter(Boolean),
    openGraph: {
      type: "website",
      url: `${SITE_URL}/categories/${slug}`,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: "ar_SA",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/categories/${slug}`,
    },
  };
}

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
