import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useCallback } from 'react';
import { MarkdownPanelProps } from '../../types/chat';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function MarkdownPanel({ 
  copySuccess, 
  sections,
  onCopy, 
  onExport, 
  onSectionUpdate,
  onEditNotification,
  extraActions 
}: Omit<MarkdownPanelProps, 'title'>) {
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

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

  const handlePdfExport = async () => {
    setIsExportingPdf(true);
    try {
      // ReactMarkdownを使用するための一時的なコンテナを作成
      const tempContainer = document.createElement('div');
      tempContainer.id = 'pdf-export-container';
      tempContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: -9999px;
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
        box-sizing: border-box;
      `;
      
      // スタイルを追加
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
        
        #pdf-export-container {
          font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif !important;
          font-size: 12pt;
          line-height: 1.6;
          color: #000;
        }
        
        #pdf-export-container * {
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        #pdf-export-container h1 { 
          font-size: 24pt; 
          margin: 20px 0 10px; 
          font-weight: 700;
          page-break-after: avoid;
        }
        
        #pdf-export-container h2 { 
          font-size: 18pt; 
          margin: 18px 0 8px; 
          font-weight: 700;
          page-break-after: avoid;
        }
        
        #pdf-export-container h3 { 
          font-size: 14pt; 
          margin: 16px 0 6px; 
          font-weight: 700;
          page-break-after: avoid;
        }
        
        #pdf-export-container p { 
          margin: 10px 0;
          text-align: justify;
        }
        
        #pdf-export-container ul, 
        #pdf-export-container ol { 
          margin: 10px 0; 
          padding-left: 30px;
        }
        
        #pdf-export-container li { 
          margin: 5px 0;
          text-align: justify;
        }
        
        #pdf-export-container table {
          border-collapse: collapse;
          width: 100%;
          margin: 15px 0;
          page-break-inside: avoid;
          font-size: 10pt;
        }
        
        #pdf-export-container th,
        #pdf-export-container td {
          border: 1px solid #333;
          padding: 8px;
          text-align: left;
          word-break: break-word;
        }
        
        #pdf-export-container th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        
        #pdf-export-container code {
          background-color: #f5f5f5;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 0.9em;
        }
        
        #pdf-export-container pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          overflow-x: auto;
          margin: 10px 0;
          font-size: 10pt;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        
        #pdf-export-container blockquote {
          border-left: 4px solid #ddd;
          padding-left: 1em;
          margin-left: 0;
          color: #666;
        }
        
        .pdf-section {
          page-break-after: auto;
          margin-bottom: 30px;
        }
        
        .pdf-section:last-child {
          page-break-after: avoid;
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(tempContainer);
      
      // ReactMarkdownを使用してコンテンツをレンダリング
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');
      
      const sectionsArray = Object.entries(sections);
      const PdfContent = () => React.createElement('div', {},
        sectionsArray.map(([sectionTitle, content]) =>
          React.createElement('div', 
            { key: sectionTitle, className: 'pdf-section' },
            React.createElement('h1', {}, sectionTitle),
            React.createElement(ReactMarkdown, {
              remarkPlugins: [remarkGfm]
            }, content)
          )
        )
      );
      
      // ReactDOM でレンダリング
      const root = ReactDOM.createRoot(tempContainer);
      root.render(React.createElement(PdfContent));
      
      // レンダリング完了を待つ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // html2canvasで高品質キャンバスに変換
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight,
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight
      });
      
      // jsPDFでPDFを生成（mmサイズ指定で正確に）
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // 最初のページに画像を追加
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // 複数ページにわたる場合の処理
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // PDFを保存
      pdf.save(`${title || 'document'}.pdf`);
      
      // クリーンアップ
      root.unmount();
      document.body.removeChild(tempContainer);
      document.head.removeChild(style);
      
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDFのエクスポートに失敗しました');
    } finally {
      setIsExportingPdf(false);
    }
  };

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
      <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm flex justify-end items-center flex-shrink-0 shadow-sm">
        <div className="flex space-x-3">
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
          <button
            onClick={handlePdfExport}
            disabled={isExportingPdf}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExportingPdf ? '生成中...' : 'エクスポート(PDF)'}
          </button>
          {extraActions}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 min-h-0 bg-gradient-to-b from-gray-50/20 to-transparent">
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
    </div>
  );
}