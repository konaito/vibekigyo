import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SlideViewProps {
  sections: Record<string, string>;
}

export default function SlideView({ sections }: SlideViewProps) {
  const slides = Object.entries(sections);
  const [currentSlide, setCurrentSlide] = useState(0);

  // キーボードナビゲーション
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setCurrentSlide(prev => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setCurrentSlide(0);
        break;
      case 'End':
        e.preventDefault();
        setCurrentSlide(slides.length - 1);
        break;
    }
  }, [slides.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, slides.length - 1)));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  if (slides.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl">スライドを表示するには、右側にセクションを追加してください</p>
        </div>
      </div>
    );
  }

  const [title, content] = slides[currentSlide];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">

      {/* スライドナビゲーション */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ⬅️
          </button>
          <span className="text-sm text-gray-600 min-w-[80px] text-center">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ➡️
          </button>
        </div>

        {/* スライド一覧 */}
        <div className="flex space-x-1 overflow-x-auto max-w-md">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={`スライド ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-xs text-gray-500">
          ← → Space: ナビゲーション
        </div>
      </div>

      {/* スライドコンテンツ */}
      <div className="flex-1 p-6 flex justify-center items-center">
        <div className="w-full max-w-5xl h-0 pb-[56.25%] relative mx-auto">
          <div className="absolute inset-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-8 flex flex-col justify-center">
          {/* スライドタイトル */}
          <div className="mb-4 pb-2 border-b-2 border-slate-300">
            <h1 className="text-xl font-bold text-slate-800 text-center">
              {title}
            </h1>
          </div>

          {/* スライドコンテンツ */}
          <div className="prose prose-sm prose-slate max-w-none text-center flex-1 overflow-y-auto">
            <div className="slide-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-3 text-slate-800">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-slate-700">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-medium mb-2 text-slate-600">{children}</h3>,
                  p: ({ children }) => <p className="text-sm mb-2 leading-relaxed text-slate-700">{children}</p>,
                  ul: ({ children }) => <ul className="text-sm mb-2 space-y-1 text-left max-w-2xl mx-auto">{children}</ul>,
                  ol: ({ children }) => <ol className="text-sm mb-2 space-y-1 text-left max-w-2xl mx-auto">{children}</ol>,
                  li: ({ children }) => <li className="text-slate-700 text-sm">{children}</li>,
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-3">
                      <table className="mx-auto border-collapse border border-slate-300 text-sm">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => <th className="border border-slate-300 px-2 py-1 bg-slate-100 font-semibold text-xs">{children}</th>,
                  td: ({ children }) => <td className="border border-slate-300 px-2 py-1 text-xs">{children}</td>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 my-3 max-w-2xl mx-auto text-left text-sm">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, ...props }) => {
                    // Check if this is inline code by looking at props or parent context
                    const isInline = !props.className?.includes('language-');
                    return isInline ? (
                      <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto my-3 text-left">
                        <code className="font-mono text-xs">{children}</code>
                      </pre>
                    );
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
          </div>
        </div>
      </div>

    </div>
  );
}