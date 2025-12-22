import { useState } from "react";
import { Form, useNavigation } from "react-router";

// --- THE TRUSTED FORM COMPONENT (ENGINEERED FOR CONVERSION) ---
function AlphaLeadForm({ labels, successMessage }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [formStatus, setFormStatus] = useState("idle"); // idle | success

  // Standardized Field Styles for friction-free entry
  const inputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const labelClasses = "block text-sm font-bold text-slate-300 mb-1 ml-1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    // Client-side submission logic to Worker
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', payload })
      });
      if (res.ok) setFormStatus("success");
    } catch (error) {
      console.error("Form submission failed", error);
    }
  };

  if (formStatus === "success") {
    return (
      <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-8 text-center animate-fade-in">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-white mb-2">Assessment Received!</h3>
        <p className="text-slate-300">{successMessage}</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Critical Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClasses}>{labels.name_label} *</label>
          <input type="text" name="name" required placeholder={labels.name_placeholder} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>{labels.phone_label} *</label>
          <input type="tel" name="phone" required placeholder={labels.phone_placeholder} className={inputClasses} />
        </div>
      </div>

      {/* Row 2: Location & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className={labelClasses}>{labels.location_label}</label>
          <input type="text" name="location" placeholder={labels.location_placeholder} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>{labels.email_label}</label>
          <input type="email" name="email" placeholder={labels.email_placeholder} className={inputClasses} />
        </div>
      </div>

      {/* Row 3: Roof Details (Dropdowns match Google Form options) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="roof_type" className={labelClasses}>{labels.roof_type_label}</label>
          <select name="roof_type" className={inputClasses + " appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBD5E1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2087.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%20100c3.6-3.6%205.4-7.8%205.4-12.8%200-5-1.8-9.3-5.4-12.9z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_1rem_center]"}>
            <option value="">Select Type...</option>
            <option value="Cement/Terracotta Tiles">Tiles (Cement/Terracotta)</option>
            <option value="Metal/Colorbond">Metal (Colorbond/Iron)</option>
            <option value="Slate/Shingle">Slate or Shingle</option>
            <option value="Commercial/Flat">Commercial / Flat Roof</option>
            <option value="Other/Unknown">Not Sure / Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="storey" className={labelClasses}>{labels.storey_label}</label>
          <select name="storey" className={inputClasses + " appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBD5E1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2087.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%20100c3.6-3.6%205.4-7.8%205.4-12.8%200-5-1.8-9.3-5.4-12.9z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_1rem_center]"}>
            <option value="">Select Level...</option>
            <option value="Single Storey">Single Storey</option>
            <option value="Double Storey">Double Storey</option>
            <option value="Triple+ / Complex">3+ Storeys / Complex</option>
          </select>
        </div>
      </div>

      {/* Row 4: Notes */}
      <div>
        <label htmlFor="notes" className={labelClasses}>{labels.notes_label}</label>
        <textarea name="notes" rows={2} placeholder={labels.notes_placeholder} className={inputClasses}></textarea>
      </div>

      <button 
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 rounded-xl text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center"
      >
        {isSubmitting ? "Sending..." : labels.submit_button_text}
      </button>
      <p className="text-xs text-slate-400 text-center">{labels.disclaimer_text}</p>
    </Form>
  );
}


// --- MAIN HOME TEMPLATE ---
export default function HomeTemplate({ data, sections }) {
  // Destructure placeholder buckets based on our new schema
  const { hero, trust_ticker, features, form_config } = sections;
  
  // JS Logic for interactive feature toggles (The "Engine" part)
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="font-sans bg-slate-900 overflow-x-hidden">
      
      {/* 1. DARK MODE HERO SECTION (Z-Pattern Anchor) */}
      <div className="relative min-h-[90vh] flex flex-col">
        {/* Background Effect (Modern SaaS Gradient) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-slate-900 opacity-60"></div>
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        {/* Navigation (Z-Points 1 & 2) */}
        <nav className="relative z-20 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="text-3xl font-black tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            {hero.brand_name_text}
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-slate-300 font-medium text-sm">{hero.emergency_label_text}</span>
            <a href={`tel:${hero.emergency_phone}`} className="bg-white/10 px-6 py-3 rounded-full text-white font-black font-mono border border-white/20 hover:bg-white/20 transition-all shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]">
              {hero.emergency_phone_display}
            </a>
          </div>
        </nav>

        {/* Main Hero Content (Z-Points 3 & 4) */}
        <div className="relative z-20 flex-grow flex items-center">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-16 px-6 py-12 items-center">
            
            {/* Left: The Hook (Z-Point 3) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-8 backdrop-blur-md">
                <span className="animate-pulse text-green-400">●</span> {hero.status_badge_text}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                {hero.headline_part1} <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {hero.headline_highlight}
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 border-l-4 border-blue-500 pl-6">
                {hero.subheadline_text}
              </p>
              
              {/* Trust Stats Row */}
              <div className="flex gap-12 border-t border-white/10 pt-8">
                {hero.stats?.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: The Conversion Engine (Z-Point 4 - FORM ANCHOR) */}
            <div className="lg:col-span-5 relative">
              {/* Glow Effect behind form */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[3rem] blur-3xl opacity-30 animate-pulse-slow"></div>
              
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center text-sm">🚀</span>
                  {form_config.form_title}
                </h2>
                {/* THE REACT FORM COMPONENT */}
                <AlphaLeadForm labels={form_config.labels} successMessage={form_config.success_message} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. INFINITE TRUST TICKER (CSS Animation) */}
      <div className="bg-white py-8 overflow-hidden relative whitespace-nowrap border-b border-slate-100">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        <div className="inline-block animate-[scroll_30s_linear_infinite]">
          {/* Repeat the list twice for seamless scrolling */}
          {[...trust_ticker.partners, ...trust_ticker.partners].map((partner, i) => (
            <span key={i} className="mx-12 text-2xl font-bold text-slate-300 grayscale hover:grayscale-0 transition-all cursor-default">
              {partner}
            </span>
          ))}
        </div>
      </div>

      {/* 3. INTERACTIVE "HOW IT WORKS" SECTION (JS Logic Demo) */}
      <div className="bg-slate-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">{features.section_title}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{features.section_subtitle}</p>
          </div>

          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Interactive Toggles (JS controls active state) */}
            <div className="md:col-span-5 space-y-4">
              {features.steps.map((step, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${activeFeature === index ? 'bg-white border-blue-600 shadow-xl scale-105' : 'bg-transparent border-transparent hover:bg-white/50'}`}
                >
                  <h3 className={`text-xl font-bold mb-2 ${activeFeature === index ? 'text-blue-900' : 'text-slate-500'}`}>
                    <span className="mr-3 opacity-50">0{index + 1}.</span> {step.title}
                  </h3>
                  {activeFeature === index && (
                    <p className="text-slate-600 pl-10 animate-fade-in">{step.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Dynamic Visual (Changes based on JS state) */}
            <div className="md:col-span-7 bg-white p-8 rounded-[3rem] shadow-2xl min-h-[400px] flex items-center justify-center border border-slate-100 relative overflow-hidden">
               {/* Placeholder for Design AI's imagination - Content AI will fill the image URL */}
               <img src={features.steps[activeFeature].image_url} alt="Feature Visual" className="rounded-2xl shadow-lg relative z-10 transition-all duration-500 transform key={activeFeature}" />
               <div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply z-0"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="bg-slate-900 text-center py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-5 mix-blend-soft-light"></div>
          <h2 className="text-white text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to secure your roof?</h2>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-blue-600 text-white px-12 py-6 rounded-full font-bold text-2xl shadow-2xl hover:bg-blue-500 transition-all hover:-translate-y-1 relative z-10">
            Start Your Assessment Now ↑
          </button>
      </div>

    </div>
  );
}

// Add needed tailwind animations to tailwind.config.js later:
// keyframes: { scroll: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-100%)' } } }
// animation: { scroll: 'scroll 30s linear infinite' }
