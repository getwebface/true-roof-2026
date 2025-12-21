export default function ServiceHubTemplate({ data, sections }) {
  return (
    <div className="min-h-screen bg-white font-sans py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 border-b-4 border-blue-600 inline-block mb-8 pb-2">
          {data.h1_heading}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-12">
          {sections?.intro_text}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections?.service_list?.map((service, i) => (
            <div key={i} className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700">{service}</h3>
              <p className="mt-2 text-slate-500 italic">Professional {data.service_category} solution</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
