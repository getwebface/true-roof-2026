export default function HomeTemplate({ data, sections }) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-extrabold mb-4">{data.h1_heading}</h1>
      <div className="bg-blue-600 text-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold">{sections.hero?.title}</h2>
        <p className="text-xl mt-4 opacity-90">{sections.hero?.subtitle}</p>
        <button className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-full font-bold">
          {sections.hero?.cta_text}
        </button>
      </div>
    </div>
  );
}
