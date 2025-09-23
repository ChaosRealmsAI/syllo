import type { JSONContent } from '@tiptap/core'

const times = <T>(n: number, fn: (i: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => fn(i))

export const buildNode = ({ type, content }: JSONContent): JSONContent =>
  content ? { type, content } : { type }

export const buildParagraph = ({ content }: Partial<JSONContent> = {}) =>
  buildNode({ type: 'paragraph', content })

export const buildColumn = ({ content }: Partial<JSONContent> = {}) =>
  buildNode({ type: 'column', content })

export const buildColumnBlock = ({ content }: Partial<JSONContent>) =>
  buildNode({ type: 'columnBlock', content })

export const buildNColumns = (n: number) => {
  const content = [buildParagraph()]
  const fn = () => buildColumn({ content })
  return times(n, fn)
}