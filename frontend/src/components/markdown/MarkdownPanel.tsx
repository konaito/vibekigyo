import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useCallback } from 'react';
import { MarkdownPanelProps } from '../../types/chat';
import SlideView from './SlideView';

export default function MarkdownPanel({ 
  title, 
  copySuccess, 
  sections,
  onCopy, 
  onExport, 
  onSectionUpdate,
  onEditNotification,
  extraActions 
}: MarkdownPanelProps) {
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [isSlideMode, setIsSlideMode] = useState(false);

  const handleTitleClick = (e: React.MouseEvent, sectionTitle: string) => {
    e.stopPropagation();
    setEditingTitle(sectionTitle);
    setNewTitle(sectionTitle);
  };

  const handleContentClick = (e: React.MouseEvent, sectionTitle: string) => {
    e.stopPropagation();
    setEditingContent(sectionTitle);
    setNewContent(sections[sectionTitle] || '');
  };

  const handleTitleSave = useCallback(() => {
    if (editingTitle && newTitle.trim() && newTitle !== editingTitle) {
      // タイトル変更をセクション更新として処理
      const content = sections[editingTitle];
      onSectionUpdate(newTitle.trim(), content);
      // 古いセクションを削除（空文字で更新）
      onSectionUpdate(editingTitle, '');
      
      // チャットに編集通知を送信
      onEditNotification?.(`セクションタイトルを「${editingTitle}」から「${newTitle.trim()}」に変更しました。`);
    }
    setEditingTitle(null);
    setNewTitle('');
  }, [editingTitle, newTitle, sections, onSectionUpdate, onEditNotification]);

  const handleTitleCancel = useCallback(() => {
    setEditingTitle(null);
    setNewTitle('');
  }, []);

  const handleContentSave = useCallback(() => {
    if (editingContent) {
      // 空のコンテンツの場合は削除確認
      if (newContent.trim() === '') {
        if (confirm(`「${editingContent}」セクションを削除しますか？`)) {
          onSectionUpdate(editingContent, '');
          onEditNotification?.(`「${editingContent}」セクションを削除しました。`);
        } else {
          // キャンセルされた場合は元の内容を復元
          setNewContent(sections[editingContent] || '');
          return;
        }
      } else {
        onSectionUpdate(editingContent, newContent);
        
        // チャットに編集通知を送信
        const preview = newContent.length > 50 ? newContent.substring(0, 50) + '...' : newContent;
        onEditNotification?.(`「${editingContent}」セクションの内容を編集しました: ${preview}`);
      }
    }
    setEditingContent(null);
    setNewContent('');
  }, [editingContent, newContent, sections, onSectionUpdate, onEditNotification]);

  const handleContentCancel = useCallback(() => {
    setEditingContent(null);
    setNewContent('');
  }, []);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTitle) {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          handleTitleSave();
        } else if (e.key === 'Escape') {
          handleTitleCancel();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleTitleSave();
        }
      } else if (editingContent) {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          handleContentSave();
        } else if (e.key === 'Escape') {
          handleContentCancel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingTitle, editingContent, handleTitleSave, handleTitleCancel, handleContentSave, handleContentCancel]);

  return (
    <div className="flex flex-col bg-white h-screen">
      <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm flex justify-between items-center flex-shrink-0 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsSlideMode(!isSlideMode)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md ${
              isSlideMode 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700' 
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'
            }`}
            title={isSlideMode ? 'Markdown表示に戻る' : 'スライド表示に切り替え'}
          >
            {isSlideMode ? '📄 Markdown' : '📊 スライド'}
          </button>
          <button
            onClick={onCopy}
            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            {copySuccess ? '✓ コピー完了' : 'コピー'}
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            エクスポート(md)
          </button>
          {extraActions}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0 bg-gradient-to-b from-gray-50/20 to-transparent">
        {isSlideMode ? (
          <SlideView sections={sections} />
        ) : (
          <div className="p-8">
            <div className="prose prose-gray max-w-none prose-table:text-sm">
              {Object.entries(sections).map(([sectionTitle, content]) => (
            <div 
              key={sectionTitle} 
              className="mb-4 p-4 rounded-xl transition-all duration-300 hover:border-2 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-lg hover:scale-[1.02] group border-2 border-transparent"
            >
              <div className="flex items-center justify-between">
              {editingTitle === sectionTitle ? (
                <div className="border-b-2 border-blue-200 pb-2 mb-4 mt-0 flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 text-lg font-semibold bg-blue-50 border-2 border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleTitleSave}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleTitleCancel}
                    className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <h2 className="group-hover:text-blue-600 transition-colors duration-200 border-b-2 border-blue-200 pb-2 mb-4 mt-0 flex items-center">
                  <span 
                    className="mr-2 cursor-pointer hover:bg-blue-100 px-1 rounded" 
                    onClick={(e) => handleTitleClick(e, sectionTitle)}
                    title="タイトルをクリックして編集"
                  >
                    {sectionTitle}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">✏️</span>
                </h2>
              )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`「${sectionTitle}」セクションを削除しますか？`)) {
                      onSectionUpdate(sectionTitle, '');
                      onEditNotification?.(`「${sectionTitle}」セクションを削除しました。`);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1 text-red-600 hover:bg-red-100 rounded text-sm"
                  title="セクションを削除"
                >
                  🗑️ 削除
                </button>
              </div>

              {editingContent === sectionTitle ? (
                <div className="space-y-2">
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full h-64 p-4 border-2 border-blue-300 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-blue-50/50 shadow-inner"
                    placeholder="Markdownで編集してください..."
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleContentSave}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      💾 保存
                    </button>
                    <button
                      onClick={handleContentCancel}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                      ❌ キャンセル
                    </button>
                  </div>
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                    💡 <strong>Markdown記法:</strong> **太字**、*斜体*、`コード`、[リンク](URL)、## 見出し、- リスト項目<br/>
                    🗑️ <strong>削除:</strong> 内容を空にして保存するとセクションが削除されます
                  </div>
                </div>
              ) : (
                <div 
                  className="ml-4 group-hover:ml-6 transition-all duration-200 cursor-pointer hover:bg-blue-100 p-2 rounded"
                  onClick={(e) => handleContentClick(e, sectionTitle)}
                  title="コンテンツをクリックして編集"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              )}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}