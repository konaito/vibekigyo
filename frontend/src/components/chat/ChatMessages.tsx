import { Message } from '../../types/chat';
import LoadingIndicator from './LoadingIndicator';

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
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          </div>
        </div>
      ))}
      {isLoading && <LoadingIndicator />}
      <div ref={chatEndRef} />
    </div>
  );
}