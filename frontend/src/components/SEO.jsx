import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, canonical, image, jsonLd, type = "website" }) {
  const t = title || "Brevitus Technology";
  const d = description || "Job-ready EdTech courses in Data Science, AI, Analytics.";
  const c = canonical || (typeof window !== "undefined" ? window.location.href : "");
  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      {c && <link rel="canonical" href={c} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
