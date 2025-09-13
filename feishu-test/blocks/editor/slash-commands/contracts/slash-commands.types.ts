import { Editor } from '@tiptap/react';

export interface SlashCommand {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  group?: string;
  command: (editor: Editor) => void;
}

export interface SlashCommandGroup {
  name: string;
  commands: SlashCommand[];
}

export interface SlashMenuProps {
  editor: Editor;
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
}