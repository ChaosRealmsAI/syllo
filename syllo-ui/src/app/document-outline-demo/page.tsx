'use client';

import { useState } from 'react';
import { DocumentOutline } from '@/components/document-outline';
import { FeishuNav } from '@/components/feishu-nav';

export default function DocumentOutlineDemo() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Feishu Navigation Bar */}
      <FeishuNav
        breadcrumbs={[
          { id: '1', label: '演示' },
          { id: '2', label: '文档大纲' }
        ]}
        title="文档大纲组件演示"
        isPinned={false}
        lastModified="最近修改: 刚刚"
        onShareClick={() => alert('分享功能')}
        onEditModeChange={() => {}}
        editMode="view"
        notificationCount={0}
        userName="用户"
        onSidebarToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left sidebar with TOC */}
          {!sidebarCollapsed && (
            <DocumentOutline
              isCollapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 py-8">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {/* Introduction Section */}
              <section id="introduction" className="mb-16">
                <h1 className="text-4xl font-bold mb-6">介绍</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  这是一个文档大纲组件的演示页面，展示了自动跟踪滚动位置、
                  折叠展开、活动指示器等功能。
                </p>

                {/* Overview */}
                <div id="overview" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">概述</h2>
                  <p className="text-muted-foreground mb-4">
                    DocumentOutline 组件提供了一个智能的文档目录导航系统，
                    支持多级嵌套结构、自动滚动跟踪和平滑的视觉反馈。
                  </p>
                  <div className="bg-muted p-6 rounded-lg mb-6">
                    <pre className="text-sm">
                      <code>{`// 基本使用
import { DocumentOutline } from '@/components/document-outline';

<DocumentOutline
  tocData={customTocData}
  className="custom-styles"
/>`}</code>
                    </pre>
                  </div>
                  <p className="text-muted-foreground">
                    组件会自动检测页面中的标题元素，并提供平滑的滚动导航体验。
                  </p>
                </div>

                {/* Getting Started */}
                <div id="getting-started" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">快速开始</h2>
                  <p className="text-muted-foreground mb-6">
                    开始使用 DocumentOutline 组件非常简单，只需要准备好目录数据结构即可。
                  </p>
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <pre className="text-sm">
                      <code>{`// 目录数据结构
const tocData = [
  {
    id: 'section-1',
    title: '第一章',
    level: 1,
    children: [
      {
        id: 'section-1-1',
        title: '1.1 子章节',
        level: 2,
      }
    ]
  }
];`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Components Section */}
              <section id="components" className="mb-16">
                <h1 className="text-4xl font-bold mb-6">组件</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  这里介绍项目中的主要组件和它们的功能特性。
                </p>

                {/* Block Editor */}
                <div id="block-editor" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">块编辑器</h2>
                  <p className="text-muted-foreground mb-4">
                    块编辑器是一个功能强大的富文本编辑器，支持多种块类型，
                    包括文本、列表、表格、任务卡片等。
                  </p>
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <pre className="text-sm">
                      <code>{`// 块编辑器使用示例
import { Editor } from '@/components/block-editor';

<Editor
  blocks={blocks}
  onChange={handleChange}
  activeBlockId={activeBlockId}
/>`}</code>
                    </pre>
                  </div>
                </div>

                {/* Document Outline */}
                <div id="document-outline" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">文档大纲</h2>
                  <p className="text-muted-foreground mb-4">
                    文档大纲组件提供智能的导航功能，自动跟踪用户的阅读位置，
                    并提供平滑的滚动体验。
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>自动滚动跟踪</li>
                    <li>活动项目高亮</li>
                    <li>折叠/展开功能</li>
                    <li>平滑滚动动画</li>
                    <li>多级嵌套支持</li>
                  </ul>
                </div>

                {/* UI Components */}
                <div id="ui-components" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">UI 组件</h2>
                  <p className="text-muted-foreground mb-4">
                    基础 UI 组件库基于 shadcn/ui 构建，提供了一套完整的组件系统，
                    支持暗黑模式和自定义主题。
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">表单组件</h4>
                      <p className="text-sm text-muted-foreground">
                        Button, Input, Textarea, Select, Checkbox 等
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">布局组件</h4>
                      <p className="text-sm text-muted-foreground">
                        Card, Sheet, Sidebar, Tabs 等
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Guides Section */}
              <section id="guides" className="mb-16">
                <h1 className="text-4xl font-bold mb-6">指南</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  这里提供了详细的使用指南和最佳实践建议。
                </p>

                {/* Customization */}
                <div id="customization" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">自定义</h2>
                  <p className="text-muted-foreground mb-4">
                    所有组件都支持灵活的自定义选项，你可以通过 className 属性
                    和 CSS 变量来调整样式。
                  </p>
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <pre className="text-sm">
                      <code>{`/* 自定义样式变量 */
:root {
  --header-height: 60px;
  --toc-width: 320px;
  --foreground: hsl(210 40% 8%);
  --background: hsl(0 0% 100%);
}

/* 组件自定义 */
.custom-outline {
  --toc-width: 280px;
  border-left: 2px solid var(--border);
}`}</code>
                    </pre>
                  </div>
                </div>

                {/* Theming */}
                <div id="theming" className="mb-12">
                  <h2 className="text-3xl font-semibold mb-4">主题</h2>
                  <p className="text-muted-foreground mb-4">
                    项目支持亮色和暗色主题，所有组件都会自动适配主题变化。
                    主题切换通过 CSS 变量实现，无需重新渲染组件。
                  </p>
                  <div className="flex gap-4 mb-4">
                    <div className="bg-muted p-4 rounded-lg flex-1">
                      <h4 className="font-semibold mb-2">亮色主题</h4>
                      <p className="text-sm text-muted-foreground">
                        清新明亮的配色方案，适合日间使用
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg flex-1">
                      <h4 className="font-semibold mb-2">暗色主题</h4>
                      <p className="text-sm text-muted-foreground">
                        护眼的深色配色，适合夜间使用
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* API Section */}
              <section id="api" className="mb-16">
                <h1 className="text-4xl font-bold mb-6">API 参考</h1>
                <div className="space-y-6 text-muted-foreground">
                  <p>
                    这里是完整的 API 文档，包含所有组件的属性说明和使用示例。
                  </p>

                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">DocumentOutline Props</h3>
                    <div className="space-y-3">
                      <div>
                        <code className="text-sm bg-background px-2 py-1 rounded">tocData?: TocItem[]</code>
                        <p className="text-sm mt-1">目录数据数组，默认使用内置示例数据</p>
                      </div>
                      <div>
                        <code className="text-sm bg-background px-2 py-1 rounded">className?: string</code>
                        <p className="text-sm mt-1">自定义 CSS 类名</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">TocItem 接口</h3>
                    <div className="space-y-3">
                      <div>
                        <code className="text-sm bg-background px-2 py-1 rounded">id: string</code>
                        <p className="text-sm mt-1">唯一标识符，对应页面元素的 id</p>
                      </div>
                      <div>
                        <code className="text-sm bg-background px-2 py-1 rounded">title: string</code>
                        <p className="text-sm mt-1">显示的标题文本</p>
                      </div>
                      <div>
                        <code className="text-sm bg-background px-2 py-1 rounded">level: number</code>
                        <p className="text-sm mt-1">层级深度，用于缩进显示</p>
                      </div>
                      <div>
                        <code className="text-sm bg-background px-2 py-1 rounded">children?: TocItem[]</code>
                        <p className="text-sm mt-1">子项目数组，支持无限嵌套</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}