import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Syllo UI</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          基于 shadcn/ui 的飞书风格组件库
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/editor"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              飞书风格编辑器
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              完整的飞书风格编辑器界面，支持多列布局、拖拽调整、折叠展开、拖拽句柄等功能
            </p>
          </Link>

          <Link
            href="/drag-toolbar-demo"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              拖拽工具栏组件
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              飞书编辑器风格的拖拽工具栏，支持悬浮触发菜单、多级子菜单、表格选择器等功能
            </p>
          </Link>

          <Link
            href="/drag-editor"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              拖拽编辑器
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              可拖拽的编辑器演示，支持内容块的拖拽排序和重新排列
            </p>
          </Link>

          <Link
            href="/modern-blocks"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              现代化编辑器组件
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              基于 shadcn/ui 的完整 Markdown 语法、任务管理、文档引用和彩色高亮块
            </p>
          </Link>


          <Link
            href="/test-positioning"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              智能定位测试
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              测试菜单在不同屏幕位置的智能定位算法
            </p>
          </Link>

          <Link
            href="/supabase-toc"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Supabase 风格目录
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              仿 Supabase 文档的侧边栏目录组件，支持滚动监听、自动高亮和折叠展开
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
