"use client";

import { useState, useMemo } from "react";
import { Editor } from "@/components/block-editor/core/Editor";
import { DocumentOutline } from "@/components/document-outline";
import { FeishuNav } from "@/components/feishu-nav";
import { extractTocData } from "@/components/block-editor/utils/extractTocData";
import { EditorBlock } from "@/components/block-editor/core/EditorContent";
import { ColumnData } from "@/components/block-editor/layout/ColumnLayout";

// 完整的编辑器数据示例（支持到h5级别）
const initialBlocks: EditorBlock[] = [
  { id: "block-1", type: "heading1", content: "产品文档" },
  {
    id: "block-2",
    type: "paragraph",
    content: "这是一个完整的文档示例，展示了所有级别的标题（H1-H5）以及丰富的内容类型。左侧导航栏支持完整的滚动功能。",
  },

  { id: "block-3", type: "heading2", content: "快速开始" },
  {
    id: "block-4",
    type: "paragraph",
    content: "本章节介绍如何快速开始使用我们的产品，包括环境准备、安装步骤和基本配置。",
  },

  { id: "block-5", type: "heading3", content: "环境准备" },
  {
    id: "block-6",
    type: "paragraph",
    content: "在开始之前，请确保您的系统满足以下要求：",
  },
  {
    id: "block-7",
    type: "unorderedList",
    content: ["Node.js 16.0 或更高版本", "npm 7.0 或更高版本", "Git 最新版本"],
  },

  { id: "block-8", type: "heading4", content: "系统要求" },
  {
    id: "block-9",
    type: "paragraph",
    content: "我们推荐使用以下操作系统：",
  },
  {
    id: "block-10",
    type: "orderedList",
    content: ["macOS 11.0+", "Windows 10/11", "Ubuntu 20.04+"],
  },

  { id: "block-11", type: "heading5", content: "硬件配置" },
  {
    id: "block-12",
    type: "paragraph",
    content: "最低配置：4GB RAM，双核处理器；推荐配置：8GB RAM，四核处理器。",
  },

  { id: "block-13", type: "heading3", content: "安装步骤" },
  {
    id: "block-14",
    type: "code",
    content: `# 使用 npm 安装
npm install @company/product

# 或使用 yarn
yarn add @company/product

# 或使用 pnpm
pnpm add @company/product`,
  },

  { id: "block-15", type: "heading4", content: "验证安装" },
  {
    id: "block-16",
    type: "paragraph",
    content: "运行以下命令验证安装是否成功：",
  },
  {
    id: "block-17",
    type: "code",
    content: "npx product --version",
  },

  { id: "block-18", type: "divider", content: null },

  { id: "block-19", type: "heading2", content: "多列布局演示" },
  {
    id: "block-20",
    type: "paragraph",
    content: "下面是一个多列布局的示例，你可以拖动列之间的分隔线来调整列宽，也可以点击加号添加新列。",
  },
  {
    id: "block-21",
    type: "columnLayout",
    content: [
      {
        id: "col-1",
        width: 33,
        content: (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-bold mb-2">🚀 第一列</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              这是多列布局的第一列。你可以拖动右侧的分隔线来调整列宽。
            </p>
            <ul className="space-y-2 text-sm">
              <li>✨ 支持拖拽调整宽度</li>
              <li>📏 显示百分比宽度</li>
              <li>➕ 可以添加新列</li>
            </ul>
          </div>
        ),
      },
      {
        id: "col-2",
        width: 34,
        content: (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="text-lg font-bold mb-2">📝 第二列</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              多列布局非常适合并排展示相关内容，比如对比、参考资料等。
            </p>
            <div className="p-3 bg-white dark:bg-gray-800 rounded mt-3">
              <code className="text-xs">宽度会自动重新计算</code>
            </div>
          </div>
        ),
      },
      {
        id: "col-3",
        width: 33,
        content: (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="text-lg font-bold mb-2">🎨 第三列</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              点击列之间的分隔线上的加号按钮，可以在该位置插入新列。
            </p>
            <div className="h-16 bg-purple-100 dark:bg-purple-800 rounded flex items-center justify-center mt-3">
              <span className="text-sm">可放置任何内容</span>
            </div>
          </div>
        ),
      },
    ] as ColumnData[],
  },

  { id: "block-22", type: "divider", content: null },

  { id: "block-23", type: "heading2", content: "核心功能 - 编辑器、协作、实时同步和扩展系统" },
  {
    id: "block-24",
    type: "paragraph",
    content: "我们的产品提供了一系列强大的功能，帮助您提高工作效率。",
  },

  { id: "block-25", type: "heading3", content: "编辑器功能 - 支持多种编程语言的语法高亮、智能提示和代码格式化" },
  {
    id: "block-26",
    type: "quote",
    content: "一个现代化的编辑器应该具备智能提示、语法高亮、自动格式化等功能。",
  },

  { id: "block-27", type: "heading4", content: "代码编辑" },
  {
    id: "block-28",
    type: "paragraph",
    content: "支持多种编程语言的语法高亮和自动补全。",
  },

  { id: "block-29", type: "heading5", content: "智能提示功能和自动补全系统的详细配置说明" },
  {
    id: "block-30",
    type: "unorderedList",
    content: [
      "基于上下文的代码补全",
      "参数提示和文档查看",
      "错误和警告提示",
      "快速修复建议",
    ],
  },

  { id: "block-31", type: "heading5", content: "快捷键支持" },
  {
    id: "block-32",
    type: "paragraph",
    content: "支持 VS Code 和 Vim 风格的快捷键，可自定义键位映射。",
  },

  { id: "block-33", type: "heading4", content: "文档编辑" },
  {
    id: "block-34",
    type: "paragraph",
    content: "提供富文本编辑功能，支持 Markdown 语法。",
  },

  { id: "block-35", type: "heading3", content: "协作功能" },
  {
    id: "block-36",
    type: "paragraph",
    content: "实时协作让团队工作更高效。",
  },

  { id: "block-37", type: "heading4", content: "实时同步" },
  {
    id: "block-38",
    type: "unorderedList",
    content: [
      "实时查看其他用户的光标位置",
      "文档修改即时同步",
      "冲突自动解决",
    ],
  },

  { id: "block-39", type: "heading5", content: "实时协作模式下的多用户编辑权限管理和冲突解决策略" },
  {
    id: "block-40",
    type: "paragraph",
    content: "支持编辑模式和只读模式切换，可设置不同用户的权限级别。",
  },

  { id: "block-41", type: "divider", content: null },

  { id: "block-42", type: "heading2", content: "API 参考" },
  {
    id: "block-43",
    type: "paragraph",
    content: "详细的 API 文档帮助开发者快速集成我们的产品。",
  },

  { id: "block-44", type: "heading3", content: "基础 API" },
  {
    id: "block-45",
    type: "code",
    content: `import { Editor } from '@company/product';

const editor = new Editor({
  container: document.getElementById('editor'),
  theme: 'dark',
  language: 'javascript'
});

editor.setValue('console.log("Hello World");');`,
  },

  { id: "block-46", type: "heading4", content: "Editor 构造函数初始化选项和配置参数详解" },
  {
    id: "block-47",
    type: "paragraph",
    content: "Editor 构造函数接受以下配置选项：",
  },

  { id: "block-48", type: "heading5", content: "必填参数" },
  {
    id: "block-49",
    type: "unorderedList",
    content: ["container: HTMLElement - 编辑器容器元素"],
  },

  { id: "block-50", type: "heading5", content: "可选参数" },
  {
    id: "block-51",
    type: "unorderedList",
    content: [
      "theme: string - 主题（'light' | 'dark'）",
      "language: string - 编程语言",
      "readOnly: boolean - 是否只读",
      "fontSize: number - 字体大小",
    ],
  },

  { id: "block-52", type: "heading4", content: "事件监听" },
  {
    id: "block-53",
    type: "code",
    content: `editor.on('change', (value) => {
  console.log('内容变化:', value);
});

editor.on('save', () => {
  console.log('用户按下保存快捷键');
});`,
  },

  { id: "block-54", type: "heading3", content: "高级功能" },
  {
    id: "block-55",
    type: "paragraph",
    content: "了解更多高级功能的使用方法。",
  },

  { id: "block-56", type: "heading4", content: "插件系统" },
  {
    id: "block-57",
    type: "paragraph",
    content: "通过插件扩展编辑器功能。",
  },

  { id: "block-62", type: "heading5", content: "如何创建自定义插件来扩展编辑器的核心功能和集成第三方服务" },
  {
    id: "block-59",
    type: "code",
    content: `class MyPlugin {
  constructor(editor) {
    this.editor = editor;
  }

  activate() {
    console.log('插件已激活');
  }
}

editor.use(MyPlugin);`,
  },

  { id: "block-64", type: "divider", content: null },

  { id: "block-69", type: "heading2", content: "最佳实践" },
  {
    id: "block-62",
    type: "paragraph",
    content: "遵循这些最佳实践，充分发挥产品潜力。",
  },

  { id: "block-67", type: "heading3", content: "性能优化" },
  {
    id: "block-64",
    type: "heading4", content: "懒加载" },
  {
    id: "block-69",
    type: "paragraph",
    content: "对大文件使用懒加载策略，提高初始加载速度。",
  },

  { id: "block-70", type: "heading5", content: "分块加载示例" },
  {
    id: "block-67",
    type: "code",
    content: `const chunks = await loadFileInChunks(file, {
  chunkSize: 1024 * 100, // 100KB
  onProgress: (loaded, total) => {
    console.log(\`加载进度: \${(loaded/total*100).toFixed(2)}%\`);
  }
});`,
  },

  { id: "block-76", type: "heading3", content: "安全性" },
  {
    id: "block-69",
    type: "heading4", content: "输入验证" },
  {
    id: "block-70",
    type: "paragraph",
    content: "始终验证用户输入，防止 XSS 攻击。",
  },

  { id: "block-79", type: "heading5", content: "验证规则" },
  {
    id: "block-76",
    type: "unorderedList",
    content: [
      "转义 HTML 特殊字符",
      "限制输入长度",
      "使用白名单验证",
    ],
  },

  { id: "block-81", type: "divider", content: null },

  { id: "block-78", type: "heading2", content: "故障排除" },
  {
    id: "block-79",
    type: "heading3", content: "常见问题" },
  {
    id: "block-76",
    type: "heading4", content: "安装问题" },
  {
    id: "block-81",
    type: "heading5", content: "依赖冲突" },
  {
    id: "block-78",
    type: "paragraph",
    content: "如果遇到依赖冲突，尝试清除缓存并重新安装：",
  },
  {
    id: "block-79",
    type: "code",
    content: "npm cache clean --force\nnpm install",
  },

  { id: "block-80", type: "heading2", content: "总结" },
  {
    id: "block-81",
    type: "paragraph",
    content: "通过本文档，您应该已经了解了产品的所有核心功能。如有更多问题，请查阅详细文档或联系支持团队。",
  },
];

export default function EditorPage() {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 从blocks中提取目录数据
  const tocData = useMemo(() => {
    return extractTocData(blocks);
  }, [blocks]);

  // 处理编辑器blocks变化
  const handleBlocksChange = (newBlocks: EditorBlock[]) => {
    setBlocks(newBlocks);
  };

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    console.log('Sidebar toggled:', !sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Feishu Navigation Bar */}
      <FeishuNav
        breadcrumbs={[
          { id: '1', label: '文档' },
          { id: '2', label: '产品文档' }
        ]}
        title="产品文档"
        isPinned={false}
        lastModified="最近修改: 刚刚"
        onShareClick={() => alert('分享功能')}
        onEditModeChange={() => {}}
        editMode="edit"
        notificationCount={0}
        userName="用户"
        onSidebarToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <div className="relative w-full" style={{ paddingTop: '40px' }}>
        {/* Left sidebar with TOC - fixed position */}
        <DocumentOutline
          tocData={tocData}
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          className="fixed left-0 top-16 bottom-0 z-10"
        />

        {/* Main Editor Content */}
        <main
          className="min-h-screen transition-all duration-300"
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '320px',
            marginRight: '66px',
            maxWidth: sidebarCollapsed ? 'calc(100% - 146px)' : 'calc(100% - 386px)'
          }}
        >
          <Editor blocks={blocks} onBlocksChange={handleBlocksChange} />
        </main>
      </div>
    </div>
  );
}