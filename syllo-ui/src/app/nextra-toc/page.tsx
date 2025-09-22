'use client';

import NexTraToc from '@/components/NexTraToc';

export default function NexTraTocPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 模拟 Nextra 导航栏 */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Nextra Documentation
              </h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              TOC Demo
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* 主要内容 */}
          <main className="flex-1 py-8">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {/* Props 部分 */}
              <section id="props" className="mb-16">
                <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Props</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  The main component accepts several props to customize its behavior and appearance.
                  Here are the available configuration options:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
                  <pre className="text-sm">
                    <code>{`interface ComponentProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}`}</code>
                  </pre>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Each prop serves a specific purpose in the component configuration. The title prop
                  sets the main heading, while description provides additional context.
                </p>
              </section>

              {/* Usage 部分 */}
              <section id="usage" className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Usage</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  There are several ways to use this component depending on your specific needs.
                  Below are the most common usage patterns:
                </p>

                {/* Static head tags 子部分 */}
                <div id="static-head-tags" className="mb-12">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Static head tags</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Static head tags are the simplest way to add metadata to your pages. These tags
                    remain the same across all pages and are defined once in your configuration.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                    <pre className="text-sm">
                      <code>{`<head>
  <title>My Application</title>
  <meta name="description" content="A great application" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>`}</code>
                    </pre>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    This approach works well for applications with consistent metadata requirements.
                  </p>
                </div>

                {/* Dynamic tags based on page 子部分 */}
                <div id="dynamic-tags-based-on-page" className="mb-12">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Dynamic tags based on page</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    For more complex applications, you'll want to dynamically generate head tags based
                    on the current page content. This allows for better SEO and user experience.
                  </p>

                  {/* via Markdown front matter 子子部分 */}
                  <div id="via-markdown-front-matter" className="mb-8 ml-6">
                    <h4 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">via Markdown front matter</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Markdown front matter is a convenient way to specify page-specific metadata
                      directly in your content files.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                      <pre className="text-sm">
                        <code>{`---
title: "Page Title"
description: "Page description"
author: "Author Name"
---

# Your content here`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* via exporting metadata object 子子部分 */}
                  <div id="via-exporting-metadata-object" className="mb-8 ml-6">
                    <h4 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">
                      via exporting <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">metadata</code> object
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      You can also export a metadata object from your pages to define dynamic head tags
                      programmatically.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                      <pre className="text-sm">
                        <code>{`export const metadata = {
  title: "Dynamic Page Title",
  description: "Dynamic page description",
  openGraph: {
    title: "OG Title",
    description: "OG Description",
  },
};`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* in dynamic routes with catch-all segment 子子部分 */}
                  <div id="in-dynamic-routes-with-catch-all-segment" className="mb-8 ml-6">
                    <h4 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">in dynamic routes with catch-all segment</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      When using dynamic routes with catch-all segments, you can generate metadata
                      based on the route parameters.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                      <pre className="text-sm">
                        <code>{`export async function generateMetadata({ params }) {
  const { slug } = params;

  return {
    title: \`\${slug.join(' - ')}\`,
    description: \`Content for \${slug.join(' / ')}\`,
  };
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Theme color 子部分 */}
                <div id="theme-color" className="mb-12">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Theme color</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    The theme color meta tag helps browsers and operating systems display your
                    application with consistent branding colors.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                    <pre className="text-sm">
                      <code>{`<meta name="theme-color" content="#0070f3" />
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />`}</code>
                    </pre>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can specify different theme colors for light and dark modes to ensure
                    optimal appearance across different user preferences.
                  </p>
                </div>

                {/* Favicon glyph 子部分 */}
                <div id="favicon-glyph" className="mb-12">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Favicon glyph</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Modern browsers support emoji and Unicode characters as favicons, providing
                    a quick and easy way to add visual branding without creating icon files.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                    <pre className="text-sm">
                      <code>{`<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />

// Or using emoji directly
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />`}</code>
                    </pre>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    This approach is particularly useful for prototypes, personal projects, or
                    applications where you want to quickly add some visual identity.
                  </p>
                </div>
              </section>

              {/* 添加更多内容以便测试滚动 */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Additional Content</h2>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <p>
                    This is additional content to demonstrate the scrolling behavior of the table of contents.
                    As you scroll through this page, notice how the TOC on the right updates to highlight
                    the current section.
                  </p>
                  <p>
                    The table of contents component uses sticky positioning to remain visible as you
                    scroll, and it includes smooth scrolling behavior when you click on the navigation links.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </section>
            </article>
          </main>

          {/* 右侧目录导航 */}
          <aside className="hidden xl:block">
            <NexTraToc />
          </aside>
        </div>
      </div>
    </div>
  );
}