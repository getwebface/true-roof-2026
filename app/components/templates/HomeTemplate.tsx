export default function HomeTemplate({ data, sections }) {
  const { hero = {}, features = [] } = sections;
  return (
    <div className="bg-white text-slate-900 font-sans">
      <section className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black tracking-tight mb-6">{data.h1_heading}</h1>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">{hero.subtitle}</p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:bg-blue-700 transition-all">
              {hero.cta_text}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl mb-6 flex items-center justify-center text-blue-600 font-bold">
                {i + 1}
              </div>
              <p className="text-xl font-bold text-slate-800">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
