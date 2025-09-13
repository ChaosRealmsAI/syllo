import { EditorLayout } from '../contracts/layout.types';

export class LayoutAnalyzer {
  analyze(): EditorLayout {
    return {
      topBar: {
        left: {
          backButton: true,
          homeButton: true,
          title: '读书笔记'
        },
        center: {
          breadcrumb: ['飞书云文档', '读书笔记']
        },
        right: {
          shareButton: true,
          editModeToggle: true,
          moreOptions: true,
          userAvatar: true
        }
      },
      sidebar: {
        visible: true,
        width: 240,
        items: [
          {
            id: 'notes',
            title: '读书笔记',
            icon: '📚',
            level: 0,
            children: [
              { id: 'rich-dad', title: '富爸爸创业', level: 1 },
              { id: 'poor-dad', title: '富爸爸穷爸爸', level: 1 },
              { id: 'trading', title: '游资情绪交易系统', level: 1 }
            ]
          },
          {
            id: 'coding',
            title: 'coding',
            icon: '💻',
            level: 0,
            children: [
              { id: 'rag', title: 'RAG', level: 1 }
            ]
          }
        ]
      },
      mainEditor: {
        title: {
          text: '读书笔记',
          level: 'h1'
        },
        metadata: {
          author: 'C',
          lastModified: '今天修改'
        },
        contentArea: {
          width: 'calc(100% - 480px)',
          padding: '40px 60px'
        }
      },
      commentPanel: {
        visible: true,
        width: 320,
        position: 'right'
      }
    };
  }
}