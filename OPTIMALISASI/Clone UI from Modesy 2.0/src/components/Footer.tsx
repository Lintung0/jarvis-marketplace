const footerLinks = {
  'Marketplace': ['Browse All', 'Sell on Modesy', 'How It Works', 'Pricing Plans', 'Vendor Dashboard'],
  'Support': ['Help Center', 'Contact Us', 'Report a Problem', 'Refund Policy', 'Shipping Info'],
  'Company': ['About Us', 'Careers', 'Press', 'Blog', 'Investors'],
  'Legal': ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
}

const paymentIcons = ['Visa', 'MC', 'PayPal', 'Apple Pay', 'Stripe']

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-8">
      {/* Newsletter banner */}
      <div style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }} className="py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-bold" style={{ fontFamily: 'Poppins' }}>Get deals in your inbox</h3>
            <p className="text-orange-100 text-sm mt-1">Subscribe and get 10% off your first order</p>
          </div>
          <div className="flex w-full md:w-auto gap-2 max-w-md">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>
                Mode<span style={{ color: '#ff6b35' }}>sy</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-gray-500">
              The marketplace where buyers and sellers connect. Find unique items or start selling today.
            </p>
            <div className="flex gap-3">
              {['twitter', 'facebook', 'instagram', 'youtube'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                  <div className="w-3.5 h-3.5 bg-gray-400 rounded-sm opacity-60" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: 'Poppins' }}>{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-orange-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2026 Modesy. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 mr-1">Accepted payments:</span>
            {paymentIcons.map(p => (
              <span
                key={p}
                className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-md font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
