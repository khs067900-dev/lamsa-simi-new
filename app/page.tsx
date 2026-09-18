import HeroSection from "./components/HeroSection";
import MostDemandedSection from "./components/MostDemandedSection";
import HomeCategorySections from "./components/HomeCategorySections";
import CustomerReviews from "./components/CustomerReviews";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const SITE_URL = "https://www.lamsa-smartt.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company/public`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(2000),
    });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function Home() {
  const c = await getCompany();
  const siteName = c.nameAr || "لمسه لبيع الشرائح";
  const logoUrl = c.logo
    ? (c.logo.startsWith("http") ? c.logo : `${BACKEND}${c.logo}`)
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: c.nameEn || "lamsa-simicard",
    url: SITE_URL,
    logo: logoUrl,
    contactPoint: [
      c.phone && {
        "@type": "ContactPoint",
        telephone: c.phone,
        contactType: "customer service",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
      c.whatsapp && {
        "@type": "ContactPoint",
        telephone: c.whatsapp,
        contactType: "sales",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
    ].filter(Boolean),
    address: c.addressAr ? {
      "@type": "PostalAddress",
      addressLocality: c.addressAr,
      addressCountry: "SA",
    } : undefined,
    email: c.email || undefined,
    sameAs: c.website ? [c.website] : [],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <main className="min-h-screen">
        <HeroSection />
        <MostDemandedSection />
        <HomeCategorySections />
        <CustomerReviews />
      </main>
    </>
  );
}
