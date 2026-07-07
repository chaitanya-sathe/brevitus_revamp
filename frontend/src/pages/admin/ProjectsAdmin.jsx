import SimpleCrudPage from "@/components/admin/SimpleCrudPage";

const schema = [
  { name: "title", label: "Title", type: "text" },
  { name: "category", label: "Category", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "tech_tags", label: "Tech tags", type: "tags" },
  { name: "thumbnail", label: "Thumbnail", type: "image" },
  { name: "thumbnail_alt", label: "Thumbnail alt", type: "text" },
  { name: "external_url", label: "External URL", type: "text" },
  { name: "order", label: "Sort order", type: "number", default: 0 },
];

export default function ProjectsAdmin() {
  return (
    <SimpleCrudPage
      endpoint="/admin/projects"
      entityLabel="project"
      schema={schema}
      rowRender={(p) => (
        <div>
          <div className="font-semibold">{p.title} <span className="text-zinc-500 font-normal">· {p.category}</span></div>
          <div className="text-sm text-zinc-400 line-clamp-1">{p.description}</div>
        </div>
      )}
    />
  );
}
