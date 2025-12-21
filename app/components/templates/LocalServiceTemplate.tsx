export default function LocalServiceTemplate({ data, sections }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h1 className="text-4xl font-black text-slate-900">{data.h1_heading}</h1>
          <div className="bg-red-600 text-white px-6 py-2 rounded-full font-bold animate-pulse">
            Local to {data.location_name}
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none text-slate-700">
          <p className="mb-8 leading-relaxed text-lg">{sections?.local_intro}</p>
          
          <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-inner my-10">
            <h3 className="text-2xl font-bold mb-2">Exclusive {data.location_name} Offer</h3>
            <p className="text-blue-100 text-lg">{sections?.local_offer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
