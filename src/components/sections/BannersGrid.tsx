import Link from "next/link";

export default function BannersGrid() {
  const banners = [
    {
      title: "Clothing Collection",
      subtitle: "Up to 50% Off",
      link: "/products?category=clothing",
      bg: "bg-teal-50",
      textColor: "text-teal-900",
      accentColor: "bg-teal-600/10 text-teal-700",
      btnBg: "bg-teal-600 hover:bg-teal-700",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop&auto=format",
    },
    {
      title: "Handmade Crafts",
      subtitle: "Unique Vendor Items",
      link: "/products",
      bg: "bg-amber-50",
      textColor: "text-amber-900",
      accentColor: "bg-amber-600/10 text-amber-700",
      btnBg: "bg-amber-600 hover:bg-amber-700",
      image: "https://images.unsplash.com/photo-1457530378978-8bac673b8062?w=400&h=300&fit=crop&auto=format",
    },
    {
      title: "Electronics Deals",
      subtitle: "Direct from Sellers",
      link: "/products?category=electronics",
      bg: "bg-blue-50",
      textColor: "text-blue-900",
      accentColor: "bg-blue-600/10 text-blue-700",
      btnBg: "bg-blue-600 hover:bg-blue-700",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&auto=format",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((bn, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 ${bn.bg} border border-black/5 flex flex-col justify-between overflow-hidden relative min-h-[180px] group hover:shadow-lg transition-all`}
          >
            <div className="z-10 max-w-[60%]">
              <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${bn.accentColor}`}>
                Promo
              </span>
              <h3 className={`text-lg font-bold leading-tight ${bn.textColor}`}>{bn.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{bn.subtitle}</p>
              <Link
                href={bn.link}
                className={`inline-block mt-4 px-4 py-2 rounded-xl text-white font-semibold text-xs transition-all hover:scale-105 ${bn.btnBg}`}
              >
                Shop Now
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 w-[45%] h-full pointer-events-none transition-transform duration-500 group-hover:scale-105">
              <img
                src={bn.image}
                alt=""
                className="w-full h-full object-cover object-left"
                style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
