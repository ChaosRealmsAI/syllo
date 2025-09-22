import type { TocItem } from './types';

export const defaultTocData: TocItem[] = [
  {
    id: 'introduction',
    title: '介绍',
    level: 1,
    children: [
      {
        id: 'overview',
        title: '概述',
        level: 2,
      },
      {
        id: 'getting-started',
        title: '快速开始',
        level: 2,
      },
    ],
  },
  {
    id: 'components',
    title: '组件',
    level: 1,
    children: [
      {
        id: 'block-editor',
        title: '块编辑器',
        level: 2,
      },
      {
        id: 'document-outline',
        title: '文档大纲',
        level: 2,
      },
      {
        id: 'ui-components',
        title: 'UI 组件',
        level: 2,
      },
    ],
  },
  {
    id: 'guides',
    title: '指南',
    level: 1,
    children: [
      {
        id: 'customization',
        title: '自定义',
        level: 2,
      },
      {
        id: 'theming',
        title: '主题',
        level: 2,
      },
    ],
  },
  {
    id: 'api',
    title: 'API 参考',
    level: 1,
  },
];