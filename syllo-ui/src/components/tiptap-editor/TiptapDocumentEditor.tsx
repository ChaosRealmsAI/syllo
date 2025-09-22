"use client";

import { useState, useMemo, useCallback } from "react";
import { DocumentOutline } from "@/components/document-outline";
import { FeishuNav } from "@/components/feishu-nav";
import { TiptapEditor } from "./core/TiptapEditor";
import { Toolbar } from "@/components/editor-essentials/toolbar/Toolbar";
import { DocumentTitle } from "@/components/editor-essentials/toolbar/DocumentTitle";
import { DocumentMeta } from "@/components/editor-essentials/toolbar/DocumentMeta";
import styles from "@/components/editor-essentials/styles/editor.module.css";

interface TiptapDocumentEditorProps {
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
const extractTocFromTiptap = (content: any) => {
  if (!content || !content.content) return [];

  const toc: any[] = [];
  let currentH1: any = null;
  let currentH2: any = null;
  let headingIndex = 0;

  content.content.forEach((node: any) => {
    if (node.type === 'heading') {
      const level = node.attrs?.level || 1;
      const text = node.content?.[0]?.text || '';
      const id = `tiptap-heading-${headingIndex++}`;  // 使用递增索引确保唯一性

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

export const TiptapDocumentEditor: React.FC<TiptapDocumentEditorProps> = ({
  initialContent,
  onContentChange,
  title = "产品文档",
  breadcrumbs = [
    { id: '1', label: '文档' },
    { id: '2', label: '产品文档' }
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
    return extractTocFromTiptap(editorContent);
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
    <div className="min-h-screen bg-background">
      {/* Feishu Navigation Bar */}
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

      {/* Main Content - 完美的间距设置 */}
      <div className="relative w-full" style={{ paddingTop: '40px' }}>
        {/* Left sidebar with TOC - fixed position */}
        <DocumentOutline
          tocData={tocData}
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          className="fixed left-0 top-16 bottom-0 z-10"
        />

        {/* Main Editor Content - 完美的间距 */}
        <main
          className="min-h-screen transition-all duration-300"
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '320px',
            marginRight: '66px',
            maxWidth: sidebarCollapsed ? 'calc(100% - 146px)' : 'calc(100% - 386px)'
          }}
        >
          <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
              <Toolbar />
              <DocumentTitle
                defaultTitle={documentTitle}
                onChange={setDocumentTitle}
              />
              <DocumentMeta
                author={userName}
                lastModified={lastModified.replace('最近修改: ', '')}
              />
            </div>
            <TiptapEditor
              content={initialContent}
              onUpdate={handleContentUpdate}
              placeholder="输入 '/' 查看命令..."
            />
          </div>
        </main>
      </div>
    </div>
  );
};