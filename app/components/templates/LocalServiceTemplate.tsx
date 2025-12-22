import { useState } from "react";
import { Form, useNavigation } from "react-router";

// --- REUSABLE COMPONENTS ---

// 1. THE STICKY "THUMB ZONE" (Mobile Only)
const FixedCallBar = ({ phone, label }) => (
  <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-blue-100 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 md:hidden flex gap-3 animate-slide-up">
    <a href={`tel:${phone}`} className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl text-center shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
      <span className="text-xl">📞</span> Call
    </a>
    <button onClick={() => document.getElementById('local-form')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl text-center shadow-lg active:scale-95 transition-transform">
      {label || "Get Quote"}
    </button>
  </div>
);

// 2. THE LOCAL FORM (SaaS Style)
function LocalAssessmentForm({ locationName }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [status, setStatus] = useState("idle");

  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none";
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', payload: { ...payload, location: locationName } })
      });
      if (res.ok) setStatus("success");
    } catch (err) { console.error(err); }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="font-bold text-green-800">Request Confirmed</h3>
        <p className="text-sm text-green-600">Our local team is reviewing your address.</p>
      </div>
    );
  }

  return (
    <Form id="local-form" onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
           <label className={labelStyle}>Name</label>
           <input name="name" required placeholder="Full Name" className={inputStyle} />
        </div>
        <div>
           <label className={labelStyle}>Phone</label>
           <input name="phone" required placeholder="04XX..." className={inputStyle} />
        </div>
      </div>
      <div>
         <label className={labelStyle}>Address in {locationName}</label>
         <input name="location" defaultValue={locationName} className={inputStyle} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelStyle}>Roof Material</label>
          <select name="roof_type" className={inputStyle}>
            <option value="Tiles">Tiles</option>
            <option value="Metal">Metal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelStyle}>Issue</label>
          <select name="service" className={inputStyle}>
            <option value="Leak">Leak Repair</option>
            <option value="Restoration">Full Restoration</option>
            <option value="Gutters">Gutters</option>
          </select>
        </div>
      </div>
      <button disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-2">
        {isSubmitting ? "Connecting..." : "Check Availability Now"}
      </button>
      <div className="text-[10px] text-slate-400 text-center flex justify-center gap-2">
         <span>🔒 SSL Secure</span>
         <span>•</span>
         <span>15 Min Response</span>
      </div>
    </Form>
  );
}

// --- MAIN TEMPLATE ---
export default function LocalServiceTemplate({ data, sections }) {
  // Defensive Defaults (Prevent 500 Errors)
  const safeData = data || { h1_heading: "Roofing Services", location_name: "Local Area" };
  const safeSections = sections || {};
  const hero = safeSections.hero || {};
  const stats = safeSections.local_stats || [];
  const content = safeSections.content || {};

  return (
    <div className="font-sans bg-slate-50 min-h-screen pb-24 md:pb-0">
      
      {/* 1. COMPACT NAV (Data-Dense) */}
      <nav className="bg-slate-900 text-white p-4 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="font-black text-xl tracking-tighter">TrueRoof.</a>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden md:flex items-center gap-2 text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-800">
              <span className="animate-pulse">●</span> SYSTEMS ONLINE
            </div>
            <a href="tel:0400000000" className="font-bold bg-white/10 px-3 py-2 rounded hover:bg-white/20 transition">
              CALL 24/7
            </a>
          </div>
        </div>
      </nav>

      {/* 2. THE INTELLIGENCE HERO (Split Screen) */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-6 relative overflow-hidden">
        {/* Abstract Map Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/c/c4/Projections_with_blue_frame.jpg')] bg-cover bg-center mix-blend-screen pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left: The Offer */}
          <div>
            <div className="inline-block bg-blue-600 text-xs font-bold px-2 py-1 rounded mb-4 uppercase tracking-widest">
              Location: {safeData.location_name}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              {safeData.h1_heading}
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              {content.intro_text || "Premium roofing services deployed specifically for local weather conditions and housing types."}
            </p>
            
            {/* The "Trust Grid" */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-lg">
                  <div className="text-xs text-slate-400 uppercase">{stat.label}</div>
                  <div className="text-lg font-mono font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Operations Card (Form Container) */}
          <div className="bg-white rounded-2xl p-2 shadow-2xl shadow-blue-900/50">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <h2 className="text-slate-900 font-bold flex items-center gap-2">
                  <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">✓</span>
                  Availability Check
                </h2>
                <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-1 rounded">
                  LIVE
                </span>
              </div>
              <LocalAssessmentForm locationName={safeData.location_name} />
            </div>
          </div>

        </div>
      </div>

      {/* 3. LOCAL INSIGHTS (The "Why Us" Section) */}
      <div className="max-w-6xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
           <div className="grid md:grid-cols-3 gap-8">
             <div className="col-span-2">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Operations Report: {safeData.location_name}</h3>
                <div className="prose prose-slate text-slate-600">
                   {content.local_details || "Our data shows high wear on cement tiles in this area due to specific wind patterns. We recommend immediate ridge capping checks."}
                </div>
             </div>
             <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">Technician Note</h4>
                <p className="text-sm text-blue-800 italic">
                  "Most calls in {safeData.location_name} lately are regarding {content.common_issue || 'blocked valleys'} caused by the nearby gum trees."
                </p>
                <div className="mt-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-200 rounded-full"></div>
                   <div className="text-xs">
                      <div className="font-bold text-blue-900">Senior Tech</div>
                      <div className="text-blue-600"> Assigned to {safeData.location_name}</div>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>

      <FixedCallBar phone="0400000000" label="Check Price" />
    </div>
  );
}
