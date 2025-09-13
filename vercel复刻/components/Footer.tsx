import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-max py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/ai" className="hover:text-black transition-colors">AI</Link></li>
              <li><Link href="/enterprise" className="hover:text-black transition-colors">Enterprise</Link></li>
              <li><Link href="/fluid" className="hover:text-black transition-colors">Fluid Compute</Link></li>
              <li><Link href="/solutions/nextjs" className="hover:text-black transition-colors">Next.js</Link></li>
              <li><Link href="/products/observability" className="hover:text-black transition-colors">Observability</Link></li>
              <li><Link href="/products/previews" className="hover:text-black transition-colors">Previews</Link></li>
              <li><Link href="/products/rendering" className="hover:text-black transition-colors">Rendering</Link></li>
              <li><Link href="/security" className="hover:text-black transition-colors">Security</Link></li>
              <li><Link href="/solutions/turborepo" className="hover:text-black transition-colors">Turbo</Link></li>
              <li><Link href="https://v0.app/" className="hover:text-black transition-colors flex items-center">
                v0 
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="https://community.vercel.com/" className="hover:text-black transition-colors flex items-center">
                Community
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link></li>
              <li><Link href="/docs" className="hover:text-black transition-colors">Docs</Link></li>
              <li><Link href="/guides" className="hover:text-black transition-colors">Guides</Link></li>
              <li><Link href="/help" className="hover:text-black transition-colors">Help</Link></li>
              <li><Link href="/integrations" className="hover:text-black transition-colors">Integrations</Link></li>
              <li><Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link></li>
              <li><Link href="/resources" className="hover:text-black transition-colors">Resources</Link></li>
              <li><Link href="/partners/solution-partners" className="hover:text-black transition-colors">Solution Partners</Link></li>
              <li><Link href="/startups" className="hover:text-black transition-colors">Startups</Link></li>
              <li><Link href="/templates" className="hover:text-black transition-colors">Templates</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-black transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-black transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-black transition-colors">Careers</Link></li>
              <li><Link href="/changelog" className="hover:text-black transition-colors">Changelog</Link></li>
              <li><Link href="/events" className="hover:text-black transition-colors">Events</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="/customers" className="hover:text-black transition-colors">Customers</Link></li>
              <li><Link href="/partners" className="hover:text-black transition-colors">Partners</Link></li>
              <li><Link href="/shipped" className="hover:text-black transition-colors">Shipped</Link></li>
              <li><Link href="/legal/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Social</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="https://github.com/vercel" className="hover:text-black transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="https://linkedin.com/company/vercel" className="hover:text-black transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="https://x.com/vercel" className="hover:text-black transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://youtube.com/@VercelHQ" className="hover:text-black transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-end">
            <Link href="/" className="mb-8">
              <svg height="26" viewBox="0 0 75 65" fill="black">
                <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
          <Link href="https://vercel-status.com" className="text-sm text-gray-600 hover:text-black transition-colors">
            Loading status…
          </Link>
          
          {/* Theme switcher */}
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">Select a display theme:</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded bg-gray-100 text-black">system</button>
              <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-600">light</button>
              <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-600">dark</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}