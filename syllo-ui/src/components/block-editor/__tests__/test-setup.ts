// Jest测试环境配置
import '@testing-library/jest-dom';

// Mock CSS modules
const mockCSSModules = {
  editorWrapper: 'editorWrapper',
  editorContent: 'editorContent',
  contentBlock: 'contentBlock',
  blockContainerWithHotZone: 'blockContainerWithHotZone',
  paragraph: 'paragraph',
  heading: 'heading',
  headingH1: 'headingH1',
  headingH2: 'headingH2',
  headingH3: 'headingH3',
  dragHandleWrapper: 'dragHandleWrapper',
  blockContainer: 'blockContainer',
  toolbar: 'toolbar',
  documentTitle: 'documentTitle',
  documentMeta: 'documentMeta',
  codeBlock: 'codeBlock',
  blockquote: 'blockquote',
  divider: 'divider',
  unorderedList: 'unorderedList',
  orderedList: 'orderedList',
  column: 'column',
  columnLayout: 'columnLayout',
  columnResizer: 'columnResizer',
};

// Mock all CSS modules
jest.mock('../styles/editor.module.css', () => mockCSSModules);
jest.mock('../styles/drag.module.css', () => ({
  dragOverlay: 'dragOverlay',
  dropIndicator: 'dropIndicator',
  dragHandle: 'dragHandle',
}));

// Mock external dependencies
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(' '),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => {
  const mockIcon = ({ className, ...props }: any) => (
    <span className={className} {...props} data-testid="mock-icon" />
  );

  return {
    Plus: mockIcon,
    X: mockIcon,
    GripVertical: mockIcon,
    Calendar: mockIcon,
    Clock: mockIcon,
    Flag: mockIcon,
    MessageSquare: mockIcon,
    Paperclip: mockIcon,
    User: mockIcon,
    Edit3: mockIcon,
    MoreHorizontal: mockIcon,
    ChevronDown: mockIcon,
    ChevronRight: mockIcon,
    Bold: mockIcon,
    Italic: mockIcon,
    Underline: mockIcon,
    Code: mockIcon,
    Link: mockIcon,
    Image: mockIcon,
    Table: mockIcon,
    List: mockIcon,
    Quote: mockIcon,
    Minus: mockIcon,
  };
});

// Mock shadcn/ui components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, ...props }: any) => (
    <button
      onClick={onClick}
      className={`btn ${variant || ''} ${size || ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ className, ...props }: any) => (
    <input className={`input ${className || ''}`} {...props} />
  ),
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ className, ...props }: any) => (
    <textarea className={`textarea ${className || ''}`} {...props} />
  ),
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, children, className, ...props }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`checkbox ${className || ''}`}
      {...props}
    />
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, ...props }: any) => (
    <div className="select-wrapper" {...props}>
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        role="combobox"
      >
        {children}
      </select>
    </div>
  ),
  SelectContent: ({ children }: any) => <div className="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children, className }: any) => (
    <div className={`select-trigger ${className || ''}`}>{children}</div>
  ),
  SelectValue: ({ placeholder }: any) => <span>{placeholder || 'Select Value'}</span>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={`card ${className || ''}`} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={`card-content ${className || ''}`} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div className={`card-header ${className || ''}`} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className, ...props }: any) => (
    <span className={`badge ${variant || ''} ${className || ''}`} {...props}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => (
    <div className={`avatar ${className || ''}`}>{children}</div>
  ),
  AvatarFallback: ({ children, className }: any) => (
    <span className={`avatar-fallback ${className || ''}`}>{children}</span>
  ),
  AvatarImage: ({ src, className }: any) => (
    <img src={src} alt="avatar" className={`avatar-image ${className || ''}`} />
  ),
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div className="popover">{children}</div>,
  PopoverContent: ({ children, className }: any) => (
    <div className={`popover-content ${className || ''}`}>{children}</div>
  ),
  PopoverTrigger: ({ children }: any) => <div className="popover-trigger">{children}</div>,
}));

jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div className="tooltip">{children}</div>,
  TooltipContent: ({ children }: any) => <div className="tooltip-content">{children}</div>,
  TooltipProvider: ({ children }: any) => <div className="tooltip-provider">{children}</div>,
  TooltipTrigger: ({ children }: any) => <div className="tooltip-trigger">{children}</div>,
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children, className }: any) => (
    <table className={`table ${className || ''}`}>{children}</table>
  ),
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children, className }: any) => (
    <td className={`table-cell ${className || ''}`}>{children}</td>
  ),
  TableHead: ({ children, className }: any) => (
    <th className={`table-head ${className || ''}`}>{children}</th>
  ),
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children, className }: any) => (
    <tr className={`table-row ${className || ''}`}>{children}</tr>
  ),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock HTMLElement methods
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'closest', {
  value: function (selector: string) {
    let element: HTMLElement | null = this;
    while (element) {
      if (element.matches && element.matches(selector)) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  },
  writable: true,
});

// Mock getBoundingClientRect
HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// Suppress console warnings during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') ||
        args[0].includes('ReactDOM.render') ||
        args[0].includes('act(...)'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('componentWillMount'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test utilities
global.testUtils = {
  // 模拟拖拽事件
  createDragEvent: (type: string, dataTransfer = {}) => {
    const event = new Event(type, { bubbles: true });
    Object.defineProperty(event, 'dataTransfer', {
      value: {
        setData: jest.fn(),
        getData: jest.fn(),
        effectAllowed: 'move',
        dropEffect: 'move',
        files: [],
        items: [],
        types: [],
        ...dataTransfer,
      },
    });
    return event;
  },

  // 模拟键盘事件
  createKeyboardEvent: (key: string, options = {}) => {
    return new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      ...options,
    });
  },

  // 模拟鼠标事件
  createMouseEvent: (type: string, options = {}) => {
    return new MouseEvent(type, {
      bubbles: true,
      ...options,
    });
  },

  // 等待所有Promise解决
  waitForPromises: () => new Promise((resolve) => setImmediate(resolve)),

  // 模拟时间流逝
  advanceTime: (ms: number) => {
    jest.advanceTimersByTime(ms);
  },
};

// 类型声明
declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        createDragEvent: (type: string, dataTransfer?: any) => Event;
        createKeyboardEvent: (key: string, options?: any) => KeyboardEvent;
        createMouseEvent: (type: string, options?: any) => MouseEvent;
        waitForPromises: () => Promise<void>;
        advanceTime: (ms: number) => void;
      };
    }
  }
}

export {};