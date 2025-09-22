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
            href="/tiptap-editor"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              飞书风格编辑器
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              完整的飞书风格编辑器界面，支持多列布局、拖拽调整、折叠展开、拖拽句柄等功能
            </p>
          </Link>


        </div>
      </div>
    </div>
  );
}
