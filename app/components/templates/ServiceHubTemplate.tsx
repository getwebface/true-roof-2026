export default function ServiceHubTemplate({ data, sections }) {
  return (
    <div className="bg-white min-h-screen font-sans">
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto border-b border-slate-100">
        <div className="text-2xl font-black text-slate-900">TradePro.</div>
        <a href="/" className="text-sm font-bold text-blue-600 hover:underline">← Back to Home</a>
      </nav>

      <div className="max-w-4xl mx-auto py-16 px-6">
        {/* F-PATTERN: Heavy Left Alignment for Reading */}
        <div className="text-left mb-12 border-l-4 border-blue-600 pl-6">
          <h1 className="text-5xl font-black text-slate-900 mb-6">{data.h1_heading}</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">{sections.intro_text}</p>
        </div>

        {/* SCANNING GRID: Easy for eyes to pick a topic */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sections.service_list?.map((service, i) => (
            <div key={i} className="group p-6 border rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between">
              <span className="font-bold text-lg text-slate-700 group-hover:text-blue-700">{service}</span>
              <span className="text-slate-300 group-hover:text-blue-500">→</span>
            </div>
          ))}
        </div>

        {/* FAQ SECTION (Accordion style saves space) */}
        {sections.faq_section && (
          <div className="bg-slate-50 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
            <div className="space-y-4">
              {sections.faq_section.map((faq, i) => (
                <details key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                  <summary className="font-bold cursor-pointer list-none flex justify-between">
                    {faq.q} <span className="text-blue-500">+</span>
                  </summary>
                  <p className="mt-2 text-slate-600 text-sm">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
