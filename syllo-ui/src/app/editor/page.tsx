"use client";

import { Editor } from "@/components/block-editor/core/Editor";
import { ThemeToggle } from "@/components/theme-toggle";

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <Editor />
    </div>
  );
}