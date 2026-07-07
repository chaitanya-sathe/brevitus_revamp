import SimpleCrudPage from "@/components/admin/SimpleCrudPage";

const schema = [
  { name: "name", label: "Name", type: "text" },
  { name: "role", label: "Role", type: "text" },
  { name: "company", label: "College / Company", type: "text" },
  { name: "quote", label: "Quote", type: "textarea" },
  { name: "photo", label: "Photo", type: "image" },
  { name: "linkedin_url", label: "LinkedIn URL", type: "text" },
  { name: "rating", label: "Rating (1-5)", type: "number", default: 5 },
  { name: "order", label: "Sort order", type: "number", default: 0 },
];

export default function TestimonialsAdmin() {
  return (
    <SimpleCrudPage
      endpoint="/admin/testimonials"
      entityLabel="testimonial"
      schema={schema}
      rowRender={(t) => (
        <div>
          <div className="font-semibold">{t.name} <span className="text-zinc-500 font-normal">· {t.role}{t.company ? ` @ ${t.company}` : ""}</span></div>
          <div className="text-sm text-zinc-400 line-clamp-1">"{t.quote}"</div>
        </div>
      )}
    />
  );
}
