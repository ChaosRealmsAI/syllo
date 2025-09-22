"use client";

import { useState, useMemo, useCallback } from "react";
import { DocumentOutline } from "@/components/document-outline";
import { FeishuNav } from "@/components/feishu-nav";
import { NotionEditor } from "./NotionEditor";

interface NotionDocumentEditorProps {
  initialContent?: any;
  onContentChange?: (content: any) => void;
  title?: string;
  breadcrumbs?: Array<{ id: string; label: string }>;
  isPinned?: boolean;
  lastModified?: string;
  onShareClick?: () => void;
  onEditModeChange?: () => void;
  editMode?: "edit" | "read";
  notificationCount?: number;
  userName?: string;
  initialSidebarCollapsed?: boolean;
}

// 从 Tiptap JSON 内容中提取目录数据
const extractTocFromContent = (content: any) => {
  if (!content || !content.content) return [];

  const toc: any[] = [];
  let currentH1: any = null;
  let currentH2: any = null;
  let headingIndex = 0;

  content.content.forEach((node: any) => {
    if (node.type === 'heading') {
      const level = node.attrs?.level || 1;
      const text = node.content?.[0]?.text || '';
      const id = `heading-${headingIndex++}`;

      if (level === 1) {
        currentH1 = { id, title: text, level: 1, children: [] };
        currentH2 = null;
        toc.push(currentH1);
      } else if (level === 2) {
        const h2Item = { id, title: text, level: 2, children: [] };
        if (currentH1) {
          currentH1.children.push(h2Item);
          currentH2 = h2Item;
        } else {
          toc.push(h2Item);
          currentH2 = h2Item;
        }
      } else if (level === 3 && currentH2) {
        currentH2.children.push({ id, title: text, level: 3, children: [] });
      }
    }
  });

  return toc;
};

export const NotionDocumentEditor: React.FC<NotionDocumentEditorProps> = ({
  initialContent,
  onContentChange,
  title = "Notion 文档",
  breadcrumbs = [
    { id: '1', label: '工作空间' },
    { id: '2', label: 'Notion 文档' }
  ],
  isPinned = false,
  lastModified = "最近修改: 刚刚",
  onShareClick = () => alert('分享功能'),
  onEditModeChange = () => {},
  editMode = "edit",
  notificationCount = 0,
  userName = "用户",
  initialSidebarCollapsed = false
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed);
  const [editorContent, setEditorContent] = useState(initialContent);
  const [documentTitle, setDocumentTitle] = useState(title);

  // 从编辑器内容中提取目录数据
  const tocData = useMemo(() => {
    return extractTocFromContent(editorContent);
  }, [editorContent]);

  // 处理内容更新
  const handleContentUpdate = useCallback((content: any) => {
    setEditorContent(content);
    onContentChange?.(content);
  }, [onContentChange]);

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Feishu Navigation Bar - 复用飞书导航栏 */}
      <FeishuNav
        breadcrumbs={breadcrumbs}
        title={documentTitle}
        isPinned={isPinned}
        lastModified={lastModified}
        onShareClick={onShareClick}
        onEditModeChange={onEditModeChange}
        editMode={editMode}
        notificationCount={notificationCount}
        userName={userName}
        onSidebarToggle={handleSidebarToggle}
      />

      {/* Main Content - 正确避开导航栏 */}
      <div className="relative w-full" style={{ paddingTop: '80px' }}>
        {/* Left sidebar with TOC - 组件已内置正确布局 */}
        <DocumentOutline
          tocData={tocData}
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          className="fixed z-10"

        />

        {/* Main Editor Content - Notion 风格编辑器 */}
        <main
          className="min-h-screen transition-all duration-300"
          style={{
            marginLeft: sidebarCollapsed ? '100px' : '340px',  // 调整为：20px(目录左移) + 原来的宽度
            marginRight: '66px',
            maxWidth: sidebarCollapsed ? 'calc(100% - 166px)' : 'calc(100% - 406px)',
            paddingTop: '40px'  // 额外的顶部间距，让标题不贴着导航栏
          }}
        >
          <NotionEditor
            title={documentTitle}
            onTitleChange={setDocumentTitle}
            content={initialContent}
            onUpdate={handleContentUpdate}
            placeholder="输入 '/' 获取命令菜单，或开始输入..."
          />
        </main>
      </div>
    </div>
  );
};