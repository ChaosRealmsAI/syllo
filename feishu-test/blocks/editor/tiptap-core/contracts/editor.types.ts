import { Editor } from '@tiptap/react';

export interface EditorConfig {
  placeholder?: string;
  autofocus?: boolean;
  editable?: boolean;
  content?: string;
  onUpdate?: (content: string) => void;
}

export interface EditorInstance {
  editor: Editor | null;
  content: string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
}