'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { TocItem, SupabaseTocProps } from './types';
import { defaultTocData } from './data';

export default function SupabaseToc({ className, tocData = defaultTocData }: SupabaseTocProps) {
  const [activeId, setActiveId] = useState<string>('features');
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 48 });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const tocRef = useRef<HTMLDivElement>(null);

  // Calculate indicator position
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
    }
  }, [activeId]);

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
        rootMargin: '-10% 0px -90% 0px',
        threshold: 0.1,
      }
    );

    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id], section[id], div[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  const renderTocItems = (items: TocItem[]) => {
    return items.map((item) => (
      <div key={item.id}>
        <a
          data-active={activeId === item.id}
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            handleClick(item.id);
          }}
          className={cn(
            "block py-2 text-[0.9rem] transition-colors duration-150 [overflow-wrap:anywhere] first:pt-0 last:pb-0",
            "text-foreground-lighter hover:text-brand-link",
            "data-[active=true]:text-foreground",
            item.level === 1 ? "ps-3" : "ps-6"
          )}
        >
          {item.title}
        </a>
        {item.children && renderTocItems(item.children)}
      </div>
    ));
  };

  return (
    <div
      className={cn(
        "thin-scrollbar overflow-y-auto h-fit px-px hidden md:flex col-span-3 self-start",
        "sticky top-[calc(var(--header-height)+1px+2rem)] max-h-[calc(100vh-var(--header-height)-3rem)]",
        "transition-all duration-300",
        isCollapsed ? "w-16" : "w-72 shrink-0",
        className
      )}
      style={{
        "--header-height": "50px"
      } as React.CSSProperties}
    >
      <div className={cn(
        "w-full relative border-r flex flex-col gap-8 lg:gap-10 pr-0 h-fit border-foreground/10 transition-all duration-300",
        isCollapsed ? "pl-1" : "pl-3"
      )}>
        <div
          id="toc"
          className="sticky top-[--header-height] h-fit max-md:hidden -ml-[calc(0.25rem+6px)]"
        >
          <div className="flex h-fit w-[--toc-width] max-w-full flex-col gap-4" style={{"--toc-width": "289px"} as React.CSSProperties}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "inline-flex items-center gap-1.5 text-foreground hover:text-brand-link transition-all duration-200 py-2 rounded hover:bg-muted/50",
                isCollapsed ? "justify-center w-full px-2" : "pl-[calc(1.5rem+6px)]"
              )}
              title={isCollapsed ? "展开目录" : "收起目录"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-200"
              >
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

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
                        <div
                          role="none"
                          className="absolute w-px bg-foreground transition-all duration-150 ease-out"
                          style={{
                            top: `${indicatorStyle.top}px`,
                            height: `${indicatorStyle.height}px`,
                            right: '0',
                          }}
                        />

                        <div className="list-none text-[0.9rem] flex flex-col space-y-1 pl-[calc(0.75rem+5px)] border-foreground/10">
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