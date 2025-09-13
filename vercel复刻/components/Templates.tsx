import Link from 'next/link'

const templates = [
  { name: 'Next.js', icon: '▲', color: 'bg-black' },
  { name: 'React', icon: '⚛', color: 'bg-blue-500' },
  { name: 'Astro', icon: '🚀', color: 'bg-purple-500' },
  { name: 'Svelte', icon: '🔥', color: 'bg-orange-500' },
  { name: 'Nuxt', icon: '💚', color: 'bg-green-500' },
  { name: 'Python', icon: '🐍', color: 'bg-yellow-500' }
]

export default function Templates() {
  return (
    <section className="py-24 bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Deploy your first app in seconds.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Deploy automatically <strong>from git</strong> or with <strong>our CLI</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span><strong>Wide range</strong> support for the most popular frameworks</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span><strong>Previews</strong> for every push</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span><strong>Automatic HTTPS</strong> for all your domains</span>
            </div>
          </div>
        </div>

        {/* 模板网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {templates.map((template, index) => (
            <Link
              key={index}
              href={`/templates/${template.name.toLowerCase()}`}
              className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
                {template.icon}
              </div>
              <p className="text-sm font-medium">{template.name} Templates</p>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA部分 */}
        <div className="text-center space-y-8">
          <Link 
            href="/new"
            className="inline-block group"
          >
            <h3 className="text-5xl font-bold tracking-wider mb-4 group-hover:scale-105 transition-transform">
              <span className="inline-block hover:rotate-3 transition-transform">S</span>
              <span className="inline-block hover:-rotate-3 transition-transform">t</span>
              <span className="inline-block hover:rotate-3 transition-transform">a</span>
              <span className="inline-block hover:-rotate-3 transition-transform">r</span>
              <span className="inline-block hover:rotate-3 transition-transform">t</span>
              {' '}
              <span className="inline-block hover:-rotate-3 transition-transform">D</span>
              <span className="inline-block hover:rotate-3 transition-transform">e</span>
              <span className="inline-block hover:-rotate-3 transition-transform">p</span>
              <span className="inline-block hover:rotate-3 transition-transform">l</span>
              <span className="inline-block hover:-rotate-3 transition-transform">o</span>
              <span className="inline-block hover:rotate-3 transition-transform">y</span>
              <span className="inline-block hover:-rotate-3 transition-transform">i</span>
              <span className="inline-block hover:rotate-3 transition-transform">n</span>
              <span className="inline-block hover:-rotate-3 transition-transform">g</span>
            </h3>
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          <div className="flex justify-center space-x-6">
            <Link 
              href="/contact/sales"
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <span>Talk to an Expert</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              href="/contact/sales/enterprise-trial"
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <span>Get an Enterprise Trial</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}