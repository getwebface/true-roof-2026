export default function HomeTemplate({ data, sections }) {
  const hero = sections?.hero || {};
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-black text-slate-900 mb-4">{data.h1_heading}</h1>
        <div className="bg-blue-600 text-white p-12 rounded-[2rem] shadow-2xl transition-all hover:scale-[1.01]">
          <h2 className="text-4xl font-bold mb-4">{hero.title || "Welcome"}</h2>
          <p className="text-xl opacity-90 mb-8">{hero.subtitle}</p>
          <button className="bg-white text-blue-700 px-10 py-4 rounded-xl font-black text-lg shadow-lg">
            {hero.cta_text || "Get Started"}
          </button>
        </div>
      </section>
    </div>
  );
}
