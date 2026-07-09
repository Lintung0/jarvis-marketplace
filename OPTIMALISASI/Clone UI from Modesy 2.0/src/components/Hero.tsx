import { useState, useEffect } from 'react'
import { Link } from 'react-router'

const slides = [
  {
    id: 0,
    tag: 'New Collection',
    title: "Women's Summer\nFashion Sale",
    subtitle: 'Up to 60% off on selected items',
    cta: 'Shop Now',
    ctaLink: '/listings/Clothing',
    bg: 'from-orange-50 to-amber-100',
    accent: '#ff6b35',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&h=500&fit=crop&auto=format',
    imageAlt: 'Woman with shopping bags',
  },
  {
    id: 1,
    tag: 'Best Sellers',
    title: "Discover Unique\nHandmade Items",
    subtitle: 'Support independent sellers worldwide',
    cta: 'Explore Now',
    ctaLink: '/listings',
    bg: 'from-slate-50 to-blue-50',
    accent: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=700&h=500&fit=crop&auto=format',
    imageAlt: 'Clothing store',
  },
  {
    id: 2,
    tag: 'Weekend Deals',
    title: "Fresh Styles\nAt Great Prices",
    subtitle: 'Thousands of sellers, millions of products',
    cta: 'Browse Deals',
    ctaLink: '/listings',
    bg: 'from-green-50 to-teal-50',
    accent: '#10b981',
    image: 'https://images.unsplash.com/photo-1758274251589-fb70a3654a1b?w=700&h=500&fit=crop&auto=format',
    imageAlt: 'Women shopping',
  },
]

export default function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % slides.length), 4500)
    return () => clearInterval(t)
  }, [])

  const slide = slides[active]

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-4">
        {/* Main slider */}
        <div className={`flex-1 rounded-2xl bg-gradient-to-br ${slide.bg} overflow-hidden relative`} style={{ minHeight: 340 }}>
          <div className="flex h-full items-center justify-between p-8 md:p-12">
            <div className="flex-1 z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: slide.accent + '20', color: slide.accent }}>
                {slide.tag}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 whitespace-pre-line"
                style={{ fontFamily: 'Poppins', color: '#1a1a2e' }}>
                {slide.title}
              </h1>
              <p className="text-gray-500 mb-6 text-sm md:text-base">{slide.subtitle}</p>
              <Link to={slide.ctaLink}
                className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)` }}>
                {slide.cta} →
              </Link>
            </div>
            <div className="hidden sm:block w-72 md:w-80 h-64 md:h-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl ml-4">
              <img src={slide.image} alt={slide.imageAlt} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className="h-2 rounded-full transition-all"
                style={{ width: i === active ? 24 : 8, background: i === active ? slide.accent : '#ccc' }} />
            ))}
          </div>
        </div>

        {/* Side banners */}
        <div className="hidden lg:flex flex-col gap-4 w-52">
          <Link to="/listings/Electronics" className="flex-1 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-transform flex flex-col justify-end"
            style={{ background: '#1a1a2e', minHeight: 152 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-white opacity-60">Limited Time</p>
            <h3 className="text-lg font-bold leading-tight mb-1 text-white" style={{ fontFamily: 'Poppins' }}>Flash Sale</h3>
            <p className="text-xs text-white opacity-80">Electronics up to 40% off</p>
            <span className="mt-3 text-xs font-semibold text-white">Shop →</span>
          </Link>
          <Link to="/listings" className="flex-1 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-transform flex flex-col justify-end"
            style={{ background: '#fff3e0', minHeight: 152 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-orange-400 opacity-80">This Week</p>
            <h3 className="text-lg font-bold leading-tight mb-1 text-orange-700" style={{ fontFamily: 'Poppins' }}>New Arrivals</h3>
            <p className="text-xs text-orange-600 opacity-80">Just dropped this week</p>
            <span className="mt-3 text-xs font-semibold text-orange-500">Shop →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
