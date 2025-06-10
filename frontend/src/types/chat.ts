export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Sections {
  [key: string]: string;
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