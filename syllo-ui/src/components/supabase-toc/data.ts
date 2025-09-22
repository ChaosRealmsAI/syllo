import type { TocItem } from './types';

export const defaultTocData: TocItem[] = [
  {
    id: 'features',
    title: 'Features',
    level: 1,
    children: [
      {
        id: 'table-view',
        title: 'Table view',
        level: 2,
      },
      {
        id: 'relationships',
        title: 'Relationships',
        level: 2,
      },
      {
        id: 'clone-tables',
        title: 'Clone tables',
        level: 2,
      },
      {
        id: 'the-sql-editor',
        title: 'The SQL editor',
        level: 2,
      },
      {
        id: 'additional-features',
        title: 'Additional features',
        level: 2,
      },
      {
        id: 'extensions',
        title: 'Extensions',
        level: 2,
      },
    ],
  },
  {
    id: 'terminology',
    title: 'Terminology',
    level: 1,
    children: [
      {
        id: 'postgres-or-postgresql',
        title: 'Postgres or PostgreSQL?',
        level: 2,
      },
    ],
  },
  {
    id: 'tips',
    title: 'Tips',
    level: 1,
  },
  {
    id: 'next-steps',
    title: 'Next steps',
    level: 1,
  },
];