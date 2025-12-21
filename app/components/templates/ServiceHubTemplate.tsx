export default function ServiceHubTemplate({ data, sections }) {
  return (
    <div className="bg-slate-50 min-h-screen py-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6">{data.h1_heading}</h1>
          <p className="text-2xl text-slate-600 leading-relaxed">{sections.intro_text}</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.service_list?.map((service, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all group">
              <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600">{service}</h3>
              <button className="text-blue-600 font-bold flex items-center gap-2">
                Learn More <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
