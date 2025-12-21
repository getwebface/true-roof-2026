export default function ServiceHubTemplate({ data, sections }) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">{data.h1_heading}</h1>
      <p className="text-lg text-slate-600 mb-10">{sections.intro_text}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.service_list?.map((s, i) => (
          <div key={i} className="p-6 border rounded-xl hover:shadow-md transition">
            <h3 className="font-bold text-xl">{s}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
