import {
  H1Icon,
  H2Icon,
  H3Icon,
  OrderListIcon,
  BulletListIcon,
  TodoIcon,
  CodeBlockIcon,
  QuoteIcon,
  CalloutIcon,
  DividerIcon,
  LinkIcon,
  ImageIcon,
  AttachmentIcon,
  TableIcon,
  ColumnsIcon,
  SyncedBlockIcon,
  ChildDocIcon,
  MemberIcon,
} from './icons';
import { MenuSection, FlattenGridItem, MenuItem } from './types';

export const flattenGridItems: FlattenGridItem[] = [
  { id: 'heading1', name: 'slash heading1', tooltip: '标题1', icon: <H1Icon /> },
  { id: 'heading2', name: 'slash heading2', tooltip: '标题2', icon: <H2Icon /> },
  { id: 'heading3', name: 'slash heading3', tooltip: '标题3', icon: <H3Icon /> },
  { id: 'ordered', name: 'slash ordered', tooltip: '有序列表', icon: <OrderListIcon /> },
  { id: 'bullet', name: 'slash bullet', tooltip: '无序列表', icon: <BulletListIcon /> },
  { id: 'todo', name: 'slash todo', tooltip: '任务', icon: <TodoIcon /> },
  { id: 'code', name: 'slash code', tooltip: '代码块', icon: <CodeBlockIcon /> },
  { id: 'quote', name: 'slash quote', tooltip: '引用', icon: <QuoteIcon /> },
  { id: 'callout', name: 'slash callout', tooltip: '高亮块', icon: <CalloutIcon /> },
  { id: 'synced', name: 'synced block', tooltip: '同步块', icon: <SyncedBlockIcon /> },
  { id: 'divider', name: 'slash divider', tooltip: '分割线', icon: <DividerIcon /> },
  { id: 'link', name: 'link', tooltip: '链接', icon: <LinkIcon /> },
];

export const menuSections: MenuSection[] = [
  {
    id: 'basic',
    title: '基础',
    type: 'flatten-grid',
    items: [], // Will use flattenGridItems instead
  },
  {
    id: 'common',
    title: '常用',
    type: 'section',
    items: [
      { id: 'todo', name: 'slash todo', label: '任务', icon: <TodoIcon />, type: 'item' },
      { id: 'image', name: 'slash image', label: '图片', icon: <ImageIcon />, type: 'item' },
      { id: 'file', name: 'slash file', label: '视频或文件', icon: <AttachmentIcon />, type: 'item' },
      {
        id: 'table',
        name: 'table',
        label: '表格',
        icon: <TableIcon />,
        type: 'submenu',
        submenu: [] // Will be handled by TableGridSelector component
      },
      {
        id: 'grid',
        name: 'slash grid',
        label: '分栏',
        icon: <ColumnsIcon />,
        type: 'submenu',
        submenu: [
          { id: 'two-columns', label: '两栏', data: { columns: 2 } },
          { id: 'three-columns', label: '三栏', data: { columns: 3 } },
          { id: 'left-sidebar', label: '左侧栏', data: { layout: 'left-right' } },
          { id: 'right-sidebar', label: '右侧栏', data: { layout: 'right-left' } },
        ]
      },
      { id: 'callout', name: 'slash callout', label: '高亮块', icon: <CalloutIcon />, type: 'item' },
      { id: 'synced-block', name: 'synced block', label: '同步块', icon: <SyncedBlockIcon />, type: 'item' },
      { id: 'child-doc', name: 'newChildDoc', label: '子文档', icon: <ChildDocIcon />, type: 'item' },
    ],
  },
  {
    id: 'bitable',
    title: '多维表格',
    type: 'section',
    items: [
      {
        id: 'bitable-grid',
        name: 'bitable GridView',
        label: '表格',
        icon: <TableIcon />,
        type: 'item'
      },
      {
        id: 'bitable-kanban',
        name: 'bitable Kanban',
        label: '看板',
        icon: <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
          <path d="M4 16.5h4V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7.5h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2ZM8 4v10.5H4V4h4Zm6 0v16h-4V4h4Zm2 6.5V4h4v6.5h-4Z" fill="currentColor"/>
        </svg>,
        type: 'item'
      },
      {
        id: 'bitable-gantt',
        name: 'bitable Gantt',
        label: '甘特图',
        icon: <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
          <path d="M8.5 3.425v2.05h12v-2.05h-12Zm7.51 11.6c.824-.005 1.49-.755 1.49-1.505v-3.045c0-.728-.672-1.475-1.5-1.5H3c-.828.025-1.5.747-1.5 1.5v3.045c0 .754.672 1.505 1.5 1.505h13.01Zm-8.013 1.5h-.01a1.5 1.5 0 0 0-1.49 1.5v3.05a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-3.05a1.5 1.5 0 0 0-1.5-1.5h-13ZM3.5 10.975h12v2.05h-12v-2.05Zm4.997 7.55h12v2.05h-12v-2.05ZM6.5 2.925a1.5 1.5 0 0 1 1.5-1.5h13a1.5 1.5 0 0 1 1.5 1.5v3.05a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 0 1-1.5-1.5v-3.05Z" fill="currentColor"/>
        </svg>,
        type: 'item'
      },
      {
        id: 'bitable-gallery',
        name: 'bitable Gallery',
        label: '画册',
        icon: <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
          <path d="M2 4a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2 0v5h5V4H4ZM2 15a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5Zm2 0v5h5v-5H4ZM15 2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5Zm5 2v5h-5V4h5Zm-7 11a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5Zm2 0v5h5v-5h-5Z" fill="currentColor"/>
        </svg>,
        type: 'item'
      },
    ],
  },
  {
    id: 'team',
    title: '团队协作',
    type: 'section',
    items: [
      { id: 'mention', name: 'slash mention user', label: '人员', icon: <MemberIcon />, type: 'item' },
      {
        id: 'task-list',
        name: 'task-list',
        label: '任务清单',
        icon: <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
          <path d="M3.8 4a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v6.065a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h2.488a1 1 0 1 1 0 2H6.8a3 3 0 0 1-3-3V4Z" fill="currentColor"/>
          <path d="M23.08 12.78a1 1 0 0 1 0 1.414l-4.997 4.998-.047.047c-.627.627-1.167 1.167-1.658 1.541-.525.401-1.11.705-1.831.705-.72 0-1.306-.304-1.832-.705-.49-.374-1.03-.914-1.657-1.541l-.047-.047-.91-.91a1 1 0 1 1 1.415-1.414l.91.91c.686.687 1.132 1.129 1.503 1.412.348.265.51.295.618.295.108 0 .27-.03.618-.295.371-.283.817-.725 1.503-1.412l4.998-4.998a1 1 0 0 1 1.414 0ZM9.17 5.887a1 1 0 0 1 1-1h4.26a1 1 0 1 1 0 2h-4.26a1 1 0 0 1-1-1Z" fill="currentColor"/>
        </svg>,
        type: 'item'
      },
    ],
  },
  {
    id: 'advanced',
    title: '进阶',
    type: 'section',
    items: [
      {
        id: 'bookmark',
        name: 'bookmark block',
        label: '网页卡片',
        icon: <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
          <path d="M20 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16Zm-2 2v7.277a1 1 0 0 1-1.496.868L14.5 11l-2.004 1.145A1 1 0 0 1 11 11.277V4H4v16h16V4h-2Zm-2 0h-3v5.554l1.5-.857 1.5.857V4Z" fill="currentColor"/>
        </svg>,
        type: 'item'
      },
    ],
  },
  {
    id: 'apps',
    title: '应用连接',
    type: 'section',
    items: [
      {
        id: 'embed',
        name: 'third content blocks',
        label: '内嵌网页',
        icon: <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 2C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11Zm2.325-9.726a2 2 0 0 1-1.056 1.056l-5.113 2.178c-.41.175-.828-.26-.654-.66l2.213-5.082a2 2 0 0 1 1.033-1.034l5.098-2.228c.41-.179.831.253.66.655l-2.181 5.115Z" fill="currentColor"/>
        </svg>,
        type: 'submenu',
        submenu: [
          { id: 'figma', label: 'Figma', data: { type: 'figma' } },
          { id: 'youtube', label: 'YouTube', data: { type: 'youtube' } },
          { id: 'codepen', label: 'CodePen', data: { type: 'codepen' } },
          { id: 'custom', label: '自定义链接', data: { type: 'custom' } },
        ]
      },
    ],
  },
];