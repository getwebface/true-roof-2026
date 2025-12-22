export default function HomeTemplate({ data, sections }) {
  const { hero = {}, features = [] } = sections;
  
  return (
    <div className="bg-slate-900 text-white font-sans min-h-screen">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-black tracking-tighter">TradePro.</div>
        <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full font-bold text-sm transition">
          Find a Tradie
        </button>
      </nav>

      {/* HERO: Centered High-Impact (SaaS Style) */}
      <section className="pt-20 pb-32 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
          {data.h1_heading}
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          {hero.subtitle}
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:bg-blue-500 transition-all hover:-translate-y-1">
            {hero.cta_text}
          </button>
          <button className="bg-slate-800 text-white px-10 py-5 rounded-2xl font-bold text-xl border border-slate-700 hover:bg-slate-700 transition-all">
            Browse Locations
          </button>
        </div>
      </section>

      {/* FEATURES: Horizontal "Trust Bar" */}
      <div className="bg-white text-slate-900 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm mb-12">
            Trusted by 50,000+ Australian Homeowners
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {features.map((f, i) => (
              <div key={i} className="p-6">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold mb-2">{f.text}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
