export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          拖拽技术沙盒
        </h1>
        <p className="text-center text-gray-600 mb-12">
          研究和测试飞书风格的拖拽交互
        </p>
        
        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* 静态HTML测试 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">📝 静态HTML测试</h2>
            <p className="text-gray-600 mb-4">
              纯HTML/CSS/JS实现，无框架依赖，可直接在浏览器中运行
            </p>
            <div className="flex gap-4">
              <a 
                href="/static-test/drag-test.html" 
                target="_blank"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                基础拖拽 →
              </a>
              <a 
                href="/static-test/multi-column.html" 
                target="_blank"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                多列布局 →
              </a>
            </div>
          </div>
          
          {/* React组件测试 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">⚛️ React组件测试</h2>
            <p className="text-gray-600 mb-4">
              基于React的拖拽组件，封装了核心拖拽逻辑
            </p>
            <a 
              href="/react-demo" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              查看React演示 →
            </a>
          </div>
          
          {/* 技术文档 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">📚 技术要点</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>拖拽句柄：悬停显示，位于块左侧</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>热区扩展：块左侧60px范围内触发句柄显示</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>句柄高亮：hover句柄时块底部显示蓝色边框</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>插入指示：拖拽时显示蓝色指示线</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>框架无关：核心逻辑可在任何环境使用</span>
              </li>
            </ul>
          </div>
          
          {/* 代码结构 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">🏗️ 代码结构</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
{`drag-sandbox/
├── public/
│   └── static-test/
│       ├── drag-test.html    # 静态HTML测试
│       └── drag-system.js    # 纯JS拖拽系统
├── blocks/
│   └── drag-core/
│       ├── contracts/        # 类型定义
│       ├── impl/            # 实现
│       └── tests/           # 测试
└── app/
    ├── page.tsx            # 首页
    └── react-demo/         # React演示`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
