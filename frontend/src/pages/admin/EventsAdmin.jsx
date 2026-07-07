import SimpleCrudPage from "@/components/admin/SimpleCrudPage";

const schema = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "event_date", label: "Event date (YYYY-MM-DD)", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "apply_link", label: "Registration link", type: "text" },
  { name: "thumbnail", label: "Thumbnail", type: "image" },
  { name: "is_upcoming", label: "Upcoming?", type: "switch", default: true },
  { name: "order", label: "Sort order", type: "number", default: 0 },
];

export default function EventsAdmin() {
  return (
    <SimpleCrudPage
      endpoint="/admin/events"
      entityLabel="event"
      schema={schema}
      rowRender={(e) => (
        <div>
          <div className="font-semibold">{e.title}</div>
          <div className="text-sm text-zinc-400">{e.event_date} {e.location && `· ${e.location}`}</div>
        </div>
      )}
    />
  );
}
