import SimpleCrudPage from "@/components/admin/SimpleCrudPage";

const schema = [
  { name: "name", label: "Name", type: "text" },
  { name: "role", label: "Role", type: "text" },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "photo", label: "Photo", type: "image" },
  { name: "credentials", label: "Credentials", type: "tags" },
  { name: "linkedin_url", label: "LinkedIn URL", type: "text" },
  { name: "twitter_url", label: "Twitter URL", type: "text" },
  { name: "is_founder", label: "Is founder?", type: "switch" },
  { name: "order", label: "Sort order", type: "number", default: 0 },
];

export default function TeamAdmin() {
  return (
    <SimpleCrudPage
      endpoint="/admin/team"
      entityLabel="team member"
      schema={schema}
      rowRender={(t) => (
        <div>
          <div className="font-semibold">{t.name} {t.is_founder && <span className="ml-2 text-[10px] uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">Founder</span>}</div>
          <div className="text-sm text-zinc-400">{t.role}</div>
        </div>
      )}
    />
  );
}
