import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => { api.get(`/public/blogs/${slug}`).then((r) => setBlog(r.data)).catch(() => setErr(true)); }, [slug]);
  if (err) return <div className="mx-auto max-w-4xl px-6 py-24 text-center"><h1 className="font-heading text-4xl">Post not found</h1><Link to="/blog" className="text-purple-700 underline">Back to blog</Link></div>;
  if (!blog) return <div className="mx-auto max-w-4xl px-6 py-24 text-center text-slate-500">Loading…</div>;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": blog.title, "description": blog.excerpt, "author": { "@type": "Person", "name": blog.author },
    "datePublished": blog.published_at,
  };

  return (
    <article className="mx-auto max-w-3xl px-6 pt-14 pb-24">
      <SEO title={blog.seo_title || blog.title} description={blog.seo_description || blog.excerpt} image={blog.cover_image} jsonLd={jsonLd} type="article" />
      <Link to="/blog" className="text-sm text-purple-700 hover:text-purple-900">← All posts</Link>
      <div className="text-xs uppercase tracking-widest font-bold text-purple-700 mt-6">{blog.category}</div>
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mt-3 leading-tight">{blog.title}</h1>
      <div className="mt-4 text-sm text-slate-500">By {blog.author} · {(blog.published_at || "").slice(0, 10)}</div>
      {blog.cover_image && <img src={blog.cover_image} alt={blog.cover_alt || blog.title} className="mt-8 rounded-2xl w-full" />}
      <div className="prose-blog mt-10" data-testid="blog-content" dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
      {(blog.tags || []).length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {blog.tags.map((t) => <span key={t} className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">#{t}</span>)}
        </div>
      )}
    </article>
  );
}
