export interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

export interface SupabaseTocProps {
  className?: string;
  tocData?: TocItem[];
}