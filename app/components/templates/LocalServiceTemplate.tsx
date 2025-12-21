export default function LocalServiceTemplate({ data, sections }) {
  return (
    <div className="font-sans bg-white">
      <div className="bg-blue-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full font-bold text-sm uppercase tracking-widest">
            24/7 Response in {data.location_name}
          </span>
          <h1 className="text-5xl font-black mt-6 mb-8">{data.h1_heading}</h1>
          <p className="text-2xl text-blue-100 opacity-90 leading-relaxed">{sections.local_intro}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 -mt-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Need Help Immediately?</h2>
          <p className="text-lg text-slate-600 mb-8 font-medium">{sections.local_offer}</p>
          <button className="w-full bg-red-600 text-white py-6 rounded-2xl text-2xl font-black shadow-xl hover:bg-red-700 transition-all active:scale-95">
            CALL NOW: 04XX XXX XXX
          </button>
          <div className="mt-8 pt-8 border-t flex justify-center gap-8 text-slate-400 font-bold uppercase text-xs tracking-widest">
            <span>✓ Licensed</span> <span>✓ Local</span> <span>✓ Insured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
