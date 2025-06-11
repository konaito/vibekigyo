import { useState } from 'react';
import { Sections, updateSection, removeSection } from '../types/chat';

export function useMarkdownPanel(sections: Sections, setSections: (sections: Sections) => void) {
  const [copySuccess, setCopySuccess] = useState(false);

  const generateMarkdown = () => {
    const markdown = sections
      .map(section => `## ${section.title}\n\n${section.content}`)
      .join('\n\n');
    return markdown;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown())
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(() => {
        alert('コピーに失敗しました。');
      });
  };

  const handleExport = (filename: string) => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSectionUpdate = (sectionTitle: string, content: string) => {
    let newSections: Sections;
    if (content === '') {
      // 空文字の場合はセクションを削除
      newSections = removeSection(sections, sectionTitle);
    } else {
      newSections = updateSection(sections, sectionTitle, content);
    }
    setSections(newSections);
  };

  return {
    copySuccess,
    handleCopy,
    handleExport,
    handleSectionUpdate
  };
}