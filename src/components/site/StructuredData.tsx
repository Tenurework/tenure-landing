import { site } from "@/lib/site";

/**
 * Organization + WebSite JSON-LD.
 *
 * Every property here is a fact that can be checked against the repository or
 * the live site. Deliberately absent: aggregateRating, review, offers, price,
 * address, foundingDate, numberOfEmployees, and SoftwareApplication — none of
 * those are known, and inventing them to look sophisticated is exactly the kind
 * of claim this site is being cleaned up to remove. Google penalises fabricated
 * structured data, and a procurement reviewer reads it too.
 */
export function StructuredData() {
  const organization = {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: site.email,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/og.png`,
    },
    description: site.description,
    founder: site.founders.map((f) => ({ "@type": "Person", name: f.name })),
    sameAs: [site.socials.linkedin, site.socials.x],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en",
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is inert data, not markup; the `<` escape guards
      // against a stray "</script>" ever appearing in a value.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
