import { useState } from "react";
import { Form, useNavigation } from "react-router";

// --- FORM COMPONENT ---
function AlphaLeadForm({ labels = {}, successMessage = "Sent!" }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [formStatus, setFormStatus] = useState("idle");

  const inputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const labelClasses = "block text-sm font-bold text-slate-300 mb-1 ml-1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', payload })
      });
      if (res.ok) setFormStatus("success");
    } catch (error) {
      console.error(error);
    }
  };

  if (formStatus === "success") {
    return (
      <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-white mb-2">Received!</h3>
        <p className="text-slate-300">{successMessage}</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>{labels.name_label || "Name"} *</label>
          <input type="text" name="name" required placeholder={labels.name_placeholder} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>{labels.phone_label || "Phone"} *</label>
          <input type="tel" name="phone" required placeholder={labels.phone_placeholder} className={inputClasses} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>{labels.location_label || "Address"}</label>
          <input type="text" name="location" placeholder={labels.location_placeholder} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>{labels.email_label || "Email"}</label>
          <input type="email" name="email" placeholder={labels.email_placeholder} className={inputClasses} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>{labels.roof_type_label || "Roof Type"}</label>
          <select name="roof_type" className={inputClasses}>
             <option value="">Select...</option>
             <option value="Tiles">Tiles</option>
             <option value="Metal">Metal</option>
             <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>{labels.storey_label || "Height"}</label>
          <select name="storey" className={inputClasses}>
             <option value="">Select...</option>
             <option value="Single">Single Storey</option>
             <option value="Double">Double Storey</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClasses}>{labels.notes_label || "Notes"}</label>
        <textarea name="notes" rows={2} placeholder={labels.notes_placeholder} className={inputClasses}></textarea>
      </div>
      <button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-lg transition-all">
        {isSubmitting ? "Sending..." : labels.submit_button_text || "Get Quote"}
      </button>
      <p className="text-xs text-slate-400 text-center">{labels.disclaimer_text}</p>
    </Form>
  );
}

// --- SAFE HOME TEMPLATE ---
export default function HomeTemplate({ data, sections }) {
  // SAFETY CHECK: If sections is null, default to empty objects to prevent crash
  const safeSections = sections || {};
  const hero = safeSections.hero || {};
  const trust_ticker = safeSections.trust_ticker || { partners: [] };
  const features = safeSections.features || { steps: [] };
  const form_config = safeSections.form_config || { labels: {} };
  
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="font-sans bg-slate-900 overflow-x-hidden">
      
      {/* HERO */}
      <div className="relative min-h-[90vh] flex flex-col">
        <nav className="relative z-20 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="text-3xl font-black text-white">{hero.brand_name_text || "TrueRoof."}</div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-slate-300 font-medium text-sm">{hero.emergency_label_text}</span>
            <a href={`tel:${hero.emergency_phone}`} className="bg-white/10 px-6 py-3 rounded-full text-white font-black font-mono border border-white/20">
              {hero.emergency_phone_display || "04XX XXX XXX"}
            </a>
          </div>
        </nav>

        <div className="relative z-20 flex-grow flex items-center">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-16 px-6 py-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-8">
                 <span className="text-green-400">●</span> {hero.status_badge_text || "Online"}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8">
                {hero.headline_part1} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {hero.headline_highlight}
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 border-l-4 border-blue-500 pl-6">
                {hero.subheadline_text}
              </p>
              <div className="flex gap-12 border-t border-white/10 pt-8">
                {hero.stats?.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6">🚀 {form_config.form_title || "Get Quote"}</h2>
                <AlphaLeadForm labels={form_config.labels} successMessage={form_config.success_message} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="bg-white py-8 overflow-hidden whitespace-nowrap border-b border-slate-100">
        <div className="inline-block">
          {(trust_ticker.partners || []).map((partner, i) => (
            <span key={i} className="mx-12 text-2xl font-bold text-slate-300">
              {partner}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="bg-slate-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
           <h2 className="text-4xl font-black text-slate-900 mb-4 text-center">{features.section_title}</h2>
           <p className="text-center text-slate-600 mb-12">{features.section_subtitle}</p>

           <div className="grid md:grid-cols-12 gap-12 items-center">
             <div className="md:col-span-5 space-y-4">
               {features.steps?.map((step, index) => (
                 <div key={index} onClick={() => setActiveFeature(index)} className={`p-6 rounded-2xl cursor-pointer border-2 ${activeFeature === index ? 'bg-white border-blue-600 shadow-xl' : 'border-transparent'}`}>
                   <h3 className="text-xl font-bold mb-2 text-slate-800">0{index+1}. {step.title}</h3>
                   {activeFeature === index && <p className="text-slate-600">{step.description}</p>}
                 </div>
               ))}
             </div>
             <div className="md:col-span-7 bg-white p-8 rounded-[3rem] shadow-2xl min-h-[400px] flex items-center justify-center">
               {features.steps?.[activeFeature]?.image_url ? (
                 <img src={features.steps[activeFeature].image_url} alt="Feature" className="rounded-2xl shadow-lg" />
               ) : (
                 <div className="text-slate-300 font-bold">Image Placeholder</div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
