import SimpleCrudPage from "@/components/admin/SimpleCrudPage";

const schema = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "duration", label: "Duration", type: "text" },
  { name: "stipend", label: "Stipend", type: "text" },
  { name: "apply_link", label: "Apply link", type: "text" },
  { name: "thumbnail", label: "Thumbnail", type: "image" },
  { name: "order", label: "Sort order", type: "number", default: 0 },
];

export default function InternshipsAdmin() {
  return (
    <SimpleCrudPage
      endpoint="/admin/internships"
      entityLabel="internship"
      schema={schema}
      rowRender={(i) => (
        <div>
          <div className="font-semibold">{i.title}</div>
          <div className="text-sm text-zinc-400">{i.duration} {i.stipend && `· ${i.stipend}`}</div>
        </div>
      )}
    />
  );
}
