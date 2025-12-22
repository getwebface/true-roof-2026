import { useState } from "react";

export default function LocalServiceTemplate({ data, sections }) {
  const media = sections.media || {};
  
  // Mobile Sticky Bar (The "Thumb Zone")
  const FixedCallBar = () => (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50 md:hidden flex gap-3">
      <a href="tel:0400000000" className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl text-center shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
        <span>📞</span> Call Now
      </a>
      <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl text-center shadow-lg active:scale-95 transition-transform">
        Get Quote
      </button>
    </div>
  );

  return (
    <div className="font-sans bg-white pb-24 relative">
      {/* Z-PATTERN HEADER: Logo Top-Left, Phone Top-Right */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto border-b border-slate-100">
        <div className="text-2xl font-black text-blue-900 tracking-tighter">TradePro.</div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden md:block">24/7 Emergency Line</p>
          <a href="tel:0400000000" className="text-xl md:text-2xl font-black text-red-600 font-mono">04XX XXX XXX</a>
        </div>
      </nav>

      {/* HERO SECTION: Split Layout for Desktop (Left Align = Readable) */}
      <div className="bg-slate-50 py-12 px-6 lg:py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left: The "Hook" */}
          <div className="text-left">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md font-bold text-xs uppercase tracking-widest mb-4 inline-block">
              Serving {data.location_name}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              {data.h1_heading}
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              {sections.local_intro}
            </p>
            
            {/* Trust Signal (Placed before the fold) */}
            <div className="flex items-center gap-4 text-sm font-bold text-slate-700 bg-white inline-flex p-3 rounded-xl shadow-sm border border-slate-100">
              <span className="text-green-500">●</span> 
              <span>Available in {data.location_name} Now</span>
            </div>
          </div>

          {/* Right: The "Conversion Box" (High Contrast) */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 relative mt-6 md:mt-0">
            {/* Urgency Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg whitespace-nowrap animate-pulse">
              {sections.local_offer}
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-center text-slate-900 mt-2">Get a Fast Quote</h3>
            <p className="text-center text-slate-500 mb-6 text-sm">Response in 15 mins or less.</p>
            
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg mb-4">
              Start Free Online Quote →
            </button>
            
            <div className="text-center text-xs text-slate-400 uppercase font-bold tracking-widest">
              No Obligation • Free Check
            </div>
          </div>
        </div>
      </div>

      <FixedCallBar />
    </div>
  );
}
