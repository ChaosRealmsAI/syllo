export default function Infrastructure() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container-max">
        {/* Git-connected Deploys */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Git-connected Deploys</h2>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">From localhost to https, in seconds.</p>
              <p className="text-gray-600">Deploy from Git or your CLI.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
              <div>▲ ~ vercel-site/ git push</div>
              <div className="text-gray-400">Enumerating objects: 1, done.</div>
              <div className="text-gray-400">Counting objects: 100% (1/1), done.</div>
              <div className="text-gray-400">Writing objects: 100% (1/1), 72 bytes, done.</div>
              <div className="text-gray-400">Total 1 (delta 0), reused 0 (delta 0).</div>
              <div className="text-gray-400">To github.com:vercel/vercel-site.git</div>
              <div className="text-gray-400">21326a9..81663c3 main -{'>'} main</div>
            </div>
          </div>
        </div>

        {/* Collaborative Pre-production */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div className="order-2 md:order-1 bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-sm">Swapped out the <code className="bg-gray-200 px-1 rounded">button</code> for some variants we needed.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                <div className="flex-1 bg-blue-50 rounded-lg p-3">
                  <p className="text-sm">How about this instead?</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-200 rounded-full"></div>
                <div className="flex-1 bg-green-50 rounded-lg p-3">
                  <p className="text-sm">This looks great! 👍</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path d="M10 4a2 2 0 100-4 2 2 0 000 4z"/>
                  <path d="M10 20a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Collaborative Pre-production</h2>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Every deploy is remarkable.</p>
              <p className="text-gray-600">Chat with your team on real, production-grade UI, not just designs.</p>
            </div>
          </div>
        </div>

        {/* Observability */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Observability</h2>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Route-aware observability.</p>
              <p className="text-gray-600">Monitor and analyze the performance and traffic of your projects.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div className="h-40 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-end p-4">
                <div className="w-full h-20 bg-blue-500 rounded opacity-50"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Homepage</p>
                  <p className="text-2xl font-semibold">532,000</p>
                </div>
                <div>
                  <p className="text-gray-500">Checkout</p>
                  <p className="text-2xl font-semibold">183,300</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}