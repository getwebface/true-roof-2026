export default function LocalServiceTemplate({ data, sections }) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-blue-900">{data.h1_heading}</h1>
        <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-bold uppercase text-sm">
          {data.location_name} Specialist
        </span>
      </div>
      <div className="prose max-w-none text-slate-700">
        <p className="text-xl leading-relaxed">{sections.local_intro}</p>
        <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 p-6">
          <p className="font-bold text-amber-900">Limited Time Offer:</p>
          <p>{sections.local_offer}</p>
        </div>
      </div>
    </div>
  );
}
