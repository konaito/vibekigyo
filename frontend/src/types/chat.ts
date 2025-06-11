export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SectionItem {
  title: string;
  content: string;
}

export type Sections = SectionItem[];

// ヘルパー関数：セクションをタイトルで検索
export function findSection(sections: Sections, title: string): SectionItem | undefined {
  return sections.find(section => section.title === title);
}

// ヘルパー関数：セクションを更新
export function updateSection(sections: Sections, title: string, content: string): Sections {
  const index = sections.findIndex(section => section.title === title);
  if (index >= 0) {
    // 既存セクションを更新
    const newSections = [...sections];
    newSections[index] = { title, content };
    return newSections;
  } else {
    // 新しいセクションを末尾に追加
    return [...sections, { title, content }];
  }
}

// ヘルパー関数：セクションを削除
export function removeSection(sections: Sections, title: string): Sections {
  return sections.filter(section => section.title !== title);
}


export interface ChatProps {
  messages: Message[];
  sections: Sections;
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearHistory: () => void;
  placeholder: string;
  title: string;
  appSwitchUrl: string;
  appSwitchLabel: string;
}

export interface MarkdownPanelProps {
  title: string;
  copySuccess: boolean;
  sections: Sections;
  onCopy: () => void;
  onExport: () => void;
  onSectionUpdate: (sectionTitle: string, content: string) => void;
  onEditNotification?: (message: string) => void;
  extraActions?: React.ReactNode;
}