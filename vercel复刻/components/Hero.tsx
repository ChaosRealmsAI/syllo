import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* 彩虹渐变背景 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[600px]">
          <div className="absolute inset-0 gradient-bg opacity-30"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        {/* 网格背景 */}
        <div className="absolute inset-0 grid-bg opacity-[0.02]"></div>
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 container-max pt-32 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* 主标题 */}
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Build and deploy on the AI Cloud.
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.
          </p>
          
          {/* CTA按钮 */}
          <div className="flex items-center justify-center space-x-4">
            <Link 
              href="/new"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>Start Deploying</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              href="/contact/sales"
              className="inline-flex items-center px-6 py-3 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get a Demo
            </Link>
          </div>
        </div>

        {/* Vercel Logo中心装饰 */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-32 h-32 opacity-10">
          <svg viewBox="0 0 75 65" fill="black">
            <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
          </svg>
        </div>
      </div>
    </section>
  )
}