export function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
        <Icon className="size-6 text-orange-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
