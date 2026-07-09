import { Link } from 'react-router'

const categories = [
  { name: 'Clothing', count: '24.5k', icon: '👗', bg: '#fff3e0', border: '#ffcc80' },
  { name: 'Shoes', count: '18.2k', icon: '👟', bg: '#e8f5e9', border: '#a5d6a7' },
  { name: 'Home & Living', count: '31.7k', icon: '🛋️', bg: '#e3f2fd', border: '#90caf9' },
  { name: 'Jewelry', count: '9.8k', icon: '💍', bg: '#fce4ec', border: '#f48fb1' },
  { name: 'Electronics', count: '15.3k', icon: '📱', bg: '#ede7f6', border: '#b39ddb' },
  { name: 'Sports', count: '11.4k', icon: '⚽', bg: '#e0f7fa', border: '#80deea' },
  { name: 'Toys', count: '7.6k', icon: '🧸', bg: '#fff8e1', border: '#ffe082' },
  { name: 'Books', count: '22.1k', icon: '📚', bg: '#efebe9', border: '#bcaaa4' },
]

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>Browse Categories</h2>
          <p className="text-gray-500 text-sm mt-0.5">Find exactly what you're looking for</p>
        </div>
        <Link to="/listings" className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map(cat => (
          <Link key={cat.name} to={`/listings/${encodeURIComponent(cat.name)}`}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:shadow-md hover:scale-105 cursor-pointer group"
            style={{ background: cat.bg, borderColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = cat.border)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
            <span className="text-3xl">{cat.icon}</span>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-800 leading-tight" style={{ fontFamily: 'Poppins' }}>{cat.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
