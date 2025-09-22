'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { TocItem, DocumentOutlineProps } from './types';
import { defaultTocData } from './data';

export default function DocumentOutline({
  className,
  tocData = defaultTocData,
  isCollapsed: externalIsCollapsed,
  onCollapsedChange
}: DocumentOutlineProps) {
  // Set initial activeId to the first item in tocData
  const initialActiveId = tocData.length > 0 ? tocData[0].id : 'introduction';
  const [activeId, setActiveId] = useState<string>(initialActiveId);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 48 });
  const [internalIsCollapsed, setInternalIsCollapsed] = useState<boolean>(false);
  const [isManualScrolling, setIsManualScrolling] = useState<boolean>(false);

  // Use external state if provided, otherwise use internal state
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const tocRef = useRef<HTMLDivElement>(null);
  const tocContainerRef = useRef<HTMLDivElement>(null);

  // Calculate indicator position and auto-scroll to active item
  useEffect(() => {
    if (!tocRef.current) return;

    const activeLink = tocRef.current.querySelector(`[href="#${activeId}"]`) as HTMLElement;
    if (activeLink) {
      const tocContainer = tocRef.current;
      const linkRect = activeLink.getBoundingClientRect();
      const containerRect = tocContainer.getBoundingClientRect();

      const relativeTop = linkRect.top - containerRect.top;
      const linkHeight = linkRect.height;

      setIndicatorStyle({
        top: relativeTop,
        height: linkHeight,
      });

      // Auto-scroll the TOC to keep active item visible (only when not manually scrolling)
      if (tocContainerRef.current && activeLink && !isManualScrolling) {
        // Get the scrollable container
        const scrollContainer = tocContainerRef.current;
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();

        // Calculate relative position
        const linkRelativeTop = linkRect.top - containerRect.top;
        const containerHeight = containerRect.height;

        // Scroll to center the active item when it's outside the comfortable viewing area
        if (linkRelativeTop < 100 || linkRelativeTop > containerHeight - 100) {
          activeLink.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [activeId, isManualScrolling]);

  // Scroll listener
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((top, current) => {
            return current.boundingClientRect.top < top.boundingClientRect.top ? current : top;
          });
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px', // 顶部偏移80px（导航栏高度+间距）
        threshold: 0.1,
      }
    );

    // Find all block elements with IDs that are in our TOC
    const tocIds = new Set<string>();
    const collectIds = (items: TocItem[]) => {
      items.forEach(item => {
        tocIds.add(item.id);
        if (item.children) collectIds(item.children);
      });
    };
    collectIds(tocData);

    const headings = document.querySelectorAll('[id]');
    const relevantHeadings = Array.from(headings).filter(el => tocIds.has(el.id));
    relevantHeadings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [tocData]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set manual scrolling flag to prevent auto-scroll conflict
      setIsManualScrolling(true);
      setActiveId(id);

      const navHeight = 64; // 顶部导航栏高度
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementTop - navHeight - 20; // 额外20px的间距

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Reset manual scrolling flag after animation completes
      setTimeout(() => {
        setIsManualScrolling(false);
      }, 800);
    }
  };

  const renderTocItems = (items: TocItem[]) => {
    const flatItems: TocItem[] = [];

    const flatten = (items: TocItem[]) => {
      items.forEach(item => {
        flatItems.push(item);
        if (item.children) {
          flatten(item.children);
        }
      });
    };

    flatten(items);

    return flatItems.map((item) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          handleClick(item.id);
        }}
        className={cn(
          "block py-1.5 pr-2 transition-all duration-150",
          "hover:text-blue-600 dark:hover:text-blue-500",
          "select-none truncate",
          item.level === 1 ? "text-[0.95rem] font-medium" :
          item.level === 2 ? "text-[0.9rem]" :
          item.level === 3 ? "text-[0.875rem]" :
          "text-[0.85rem]",
          activeId === item.id ? "!text-[1.05rem] !text-blue-600 dark:!text-blue-500 !font-medium" : "text-gray-600 dark:text-gray-400"
        )}
        style={{
          paddingLeft: `${(item.level - 1) * 12}px`,
          maxWidth: '100%'
        }}
        title={item.title}
      >
        {item.title}
      </a>
    ));
  };

  return (
    <div
      className={cn(
        "thin-scrollbar hidden md:flex flex-col",
        "transition-all duration-300 select-none",
        "overflow-hidden",
        isCollapsed ? "w-16" : "w-[248px] shrink-0",
        className
      )}
      style={{
        "--header-height": "64px",
        fontFamily: "LarkHackSafariFont, LarkEmojiFont, LarkChineseQuote, -apple-system, system-ui, 'Helvetica Neue', Tahoma, 'PingFang SC', 'Microsoft Yahei', Arial, 'Hiragino Sans GB', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        fontSize: "14px",
        WebkitFontSmoothing: "antialiased"
      } as React.CSSProperties}
    >
      <div
        ref={tocContainerRef}
        className="w-full relative flex flex-col h-full transition-all duration-300 overflow-y-auto"
        style={{
          paddingTop: "16px",
          paddingBottom: "24px"
        }}
      >
        <button
          onClick={() => {
            const newCollapsed = !isCollapsed;
            if (onCollapsedChange) {
              onCollapsedChange(newCollapsed);
            } else {
              setInternalIsCollapsed(newCollapsed);
            }
          }}
          className={cn(
            "mb-4 mx-4 inline-flex items-center justify-center",
            "w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 rounded hover:bg-muted/50"
          )}
          title={isCollapsed ? "展开目录" : "收起目录"}
        >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "transition-all duration-200",
                  isCollapsed && "rotate-180"
                )}
              >
                <polyline points="15 18 9 12 15 6" />
                <polyline points="9 18 3 12 9 6" />
              </svg>
        </button>

        <div
          id="toc"
          className="h-fit"
        >
          <div className="flex h-fit w-full max-w-full flex-col gap-4">
            {!isCollapsed && (
              <div
                dir="ltr"
                className="relative flex flex-col ps-px"
                style={{
                  position: 'relative',
                  '--radix-scroll-area-corner-width': '0px',
                  '--radix-scroll-area-corner-height': '0px',
                } as React.CSSProperties}
              >
                <div
                  data-radix-scroll-area-viewport=""
                  className="h-full w-full rounded-[inherit]"
                  style={{ overflow: 'hidden scroll' }}
                >
                  <div style={{ minWidth: '100%', display: 'table' }}>
                    <div
                      data-radix-scroll-area-viewport=""
                      className="size-full rounded-[inherit] relative min-h-0 text-sm"
                      style={{ overflow: 'hidden scroll' }}
                      ref={tocRef}
                    >
                      <div style={{ minWidth: '100%', display: 'table' }}>
                        <div className="list-none text-[0.9rem] flex flex-col space-y-0.5 px-4 pr-2 overflow-hidden">
                          {renderTocItems(tocData)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}