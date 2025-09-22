# @syllo/block-editor

📝 **Complete block-based editor components inspired by Feishu and Notion**

A comprehensive set of React components for building modern, block-based editors with drag-and-drop functionality, rich content types, and professional aesthetics.

## Features

- 📝 **Rich Block Types** - Text, lists, code, tables, tasks, and more
- 🔄 **Drag & Drop** - Smooth block reordering with @dnd-kit
- 🎨 **Modern UI** - Feishu/Notion-inspired design
- 📱 **Responsive** - Multi-column layouts that adapt
- 🌙 **Dark Mode** - Built-in theme support
- ⚡ **Performance** - Optimized for large documents
- 🎯 **Smart Handles** - Context-aware toolbar positioning

## Installation

```bash
# Install from local components
import { Editor } from '@/components/block-editor';
import { DragHandle } from '@/components/drag-toolbar';
```

## Quick Start

```tsx
import { Editor } from '@/components/block-editor';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Editor />
    </div>
  );
}
```

## Core Components

### Editor

The main editor container with toolbar and document management.

```tsx
<Editor />
```

### EditorContent

Renders a list of blocks with drag-and-drop support.

```tsx
<EditorContent
  blocks={blocks}
  activeBlockId={activeBlockId}
  setActiveBlockId={setActiveBlockId}
/>
```

### BlockWrapper

Wraps individual blocks with toolbar and interaction logic.

```tsx
<BlockWrapper
  id="block-1"
  isActive={true}
  showToolbar={true}
>
  <YourBlockContent />
</BlockWrapper>
```

## Block Types

### Text Blocks
- `Heading` - H1, H2, H3 headings
- `Paragraph` - Rich text paragraphs
- `Blockquote` - Styled quotes

### Lists
- `OrderedList` - Numbered lists with nesting
- `UnorderedList` - Bullet lists with nesting

### Rich Content
- `CodeBlock` - Syntax-highlighted code
- `EditorTable` - Interactive tables
- `CheckboxList` - Task lists with nested items

### Media & References
- `LinkPreview` - Rich link previews
- `ColorHighlightBlock` - Colored info/warning/success blocks

### Task Management
- `TaskCard` - Individual task cards with metadata
- `KanbanBoard` - Drag-and-drop task board

### Layout
- `ColumnLayout` - Multi-column content layout
- `ColumnResizer` - Interactive column width adjustment

## Dependencies

- React 18+ / 19+
- @dnd-kit for drag-and-drop
- @radix-ui for primitives
- Tailwind CSS for styling
- Lucide React for icons

## License

MIT