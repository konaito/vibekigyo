import { Message } from '../../types/chat';
import LoadingIndicator from './LoadingIndicator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({ messages, isLoading, chatEndRef }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 bg-gradient-to-b from-gray-50/30 to-transparent">
      {messages.filter(m => m.role !== 'system').map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] p-4 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-white/90 text-gray-800 border border-gray-100'
            }`}
          >
            {message.role === 'user' ? (
              <div className="prose prose-sm max-w-none prose-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-blue-200 prose-code:bg-blue-800/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-blue-800/30 prose-pre:border prose-pre:border-blue-400/30 prose-blockquote:border-l-blue-300 prose-ul:text-white prose-ol:text-white prose-table:border-white prose-th:border-white prose-td:border-white">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <h1 className="text-xl font-bold text-white mb-3 border-b border-white/30 pb-1" {...props} />,
                    h2: (props) => <h2 className="text-lg font-semibold text-white mb-2" {...props} />,
                    h3: (props) => <h3 className="text-base font-medium text-white mb-2" {...props} />,
                    p: (props) => <p className="text-white mb-2 leading-relaxed" {...props} />,
                    ul: (props) => <ul className="text-white mb-2 ml-4 list-disc" {...props} />,
                    ol: (props) => <ol className="text-white mb-2 ml-4 list-decimal" {...props} />,
                    li: (props) => <li className="mb-1" {...props} />,
                    strong: (props) => <strong className="font-semibold text-white" {...props} />,
                    em: (props) => <em className="italic text-blue-100" {...props} />,
                    code: (props: {inline?: boolean; children?: React.ReactNode; className?: string}) => 
                      props.inline ? (
                        <code className="text-blue-200 bg-blue-800/30 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                      ) : (
                        <code className="block text-sm font-mono text-white" {...props} />
                      ),
                    pre: (props) => <pre className="bg-blue-800/30 border border-blue-400/30 rounded p-3 text-sm font-mono overflow-x-auto mb-2 text-white" {...props} />,
                    blockquote: (props) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-blue-100 mb-2" {...props} />,
                    table: (props) => <table className="w-full border-collapse border-2 border-white mb-2 text-sm !bg-transparent" {...props} />,
                    thead: (props) => <thead className="!bg-transparent" {...props} />,
                    tbody: (props) => <tbody className="!bg-transparent" {...props} />,
                    tr: (props) => <tr className="border-b border-white/70 !bg-transparent hover:!bg-transparent" {...props} />,
                    th: (props) => <th className="border border-white px-3 py-2 text-white font-bold text-left !bg-transparent hover:!bg-transparent" {...props} />,
                    td: (props) => <td className="border border-white px-3 py-2 text-white !bg-transparent hover:!bg-transparent" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none prose-blue prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-blockquote:border-l-blue-500 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-table:border-gray-400 prose-th:border-gray-400 prose-td:border-gray-400">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // カスタムコンポーネントでスタイリングを調整
                    h1: (props) => <h1 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1" {...props} />,
                    h2: (props) => <h2 className="text-lg font-semibold text-gray-800 mb-2" {...props} />,
                    h3: (props) => <h3 className="text-base font-medium text-gray-800 mb-2" {...props} />,
                    p: (props) => <p className="text-gray-700 mb-2 leading-relaxed" {...props} />,
                    ul: (props) => <ul className="text-gray-700 mb-2 ml-4 list-disc" {...props} />,
                    ol: (props) => <ol className="text-gray-700 mb-2 ml-4 list-decimal" {...props} />,
                    li: (props) => <li className="mb-1" {...props} />,
                    strong: (props) => <strong className="font-semibold text-gray-800" {...props} />,
                    em: (props) => <em className="italic text-gray-600" {...props} />,
                    code: (props: {inline?: boolean; children?: React.ReactNode; className?: string}) => 
                      props.inline ? (
                        <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                      ) : (
                        <code className="block text-sm font-mono" {...props} />
                      ),
                    pre: (props) => <pre className="bg-gray-100 border border-gray-200 rounded p-3 text-sm font-mono overflow-x-auto mb-2" {...props} />,
                    blockquote: (props) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-2" {...props} />,
                    table: (props) => <table className="w-full border-collapse border border-gray-400 mb-2 text-sm !bg-transparent" {...props} />,
                    thead: (props) => <thead className="!bg-transparent" {...props} />,
                    tbody: (props) => <tbody className="!bg-transparent" {...props} />,
                    tr: (props) => <tr className="border-b border-gray-400 !bg-transparent hover:!bg-transparent" {...props} />,
                    th: (props) => <th className="border border-gray-400 px-3 py-2 text-gray-800 font-bold text-left !bg-transparent hover:!bg-transparent" {...props} />,
                    td: (props) => <td className="border border-gray-400 px-3 py-2 text-gray-700 !bg-transparent hover:!bg-transparent" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && <LoadingIndicator />}
      <div ref={chatEndRef} />
    </div>
  );
}