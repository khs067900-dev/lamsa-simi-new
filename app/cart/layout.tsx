import type { Metadata } from "next";

const SITE_URL = "https://basmathatify.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سلة التسوق - راجع منتجاتك وأكمل طلبك بسهولة | لمسه لبيع الشرائح",
    description: "راجع المنتجات المضافة لسلتك وأكمل طلبك بسهولة. تقسيط مريح وشحن مجاني لجميع مناطق المملكة.",
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/cart` },
  };
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
