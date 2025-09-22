'use client';

import FeishuCatalogue from '@/components/FeishuCatalogue';

export default function FeishuCataloguePage() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* 左侧目录 */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        backgroundColor: '#fff',
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.08)'
      }}>
        <FeishuCatalogue />
      </div>

      {/* 右侧内容区域（模拟文档内容） */}
      <div style={{
        flex: 1,
        padding: '40px',
        backgroundColor: '#fff',
        margin: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <h1 id="Xu6Ad9RXFoqG9TxjBdmc5wOgnLd" style={{
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 600,
          color: '#1f2329'
        }}>
          读书笔记
        </h1>
        <p style={{
          marginBottom: '40px',
          color: '#646a73',
          lineHeight: '1.8'
        }}>
          这是一个飞书风格的目录组件演示页面。您可以点击左侧目录项进行导航，点击折叠图标可以展开或收起子目录。
        </p>

        <h2 id="YhAjdZ10coy13lx2DJ4c1uLunNe" style={{
          marginTop: '40px',
          marginBottom: '20px',
          fontSize: '20px',
          fontWeight: 500,
          color: '#1f2329'
        }}>
          水电费舒服
        </h2>
        <p style={{
          marginBottom: '20px',
          color: '#646a73',
          lineHeight: '1.8'
        }}>
          这是第一个子章节的内容。Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p style={{
          marginBottom: '40px',
          color: '#646a73',
          lineHeight: '1.8'
        }}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <h2 id="L9LAdXANeoWMLPxYwrJcM6P9nGd" style={{
          marginTop: '40px',
          marginBottom: '20px',
          fontSize: '20px',
          fontWeight: 500,
          color: '#1f2329'
        }}>
          123
        </h2>
        <p style={{
          marginBottom: '20px',
          color: '#646a73',
          lineHeight: '1.8'
        }}>
          这是第二个子章节的内容。Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p style={{
          marginBottom: '20px',
          color: '#646a73',
          lineHeight: '1.8'
        }}>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>

        {/* 添加更多内容以演示滚动效果 */}
        <div style={{ height: '800px', paddingTop: '40px' }}>
          <h3 style={{
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: 500,
            color: '#1f2329'
          }}>
            更多内容
          </h3>
          <p style={{
            color: '#646a73',
            lineHeight: '1.8'
          }}>
            向下滚动页面可以看到目录的滚动效果...
          </p>
        </div>
      </div>
    </div>
  );
}