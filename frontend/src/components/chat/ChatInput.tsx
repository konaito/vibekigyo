interface ChatInputProps {
  input: string;
  isLoading: boolean;
  placeholder: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({ input, isLoading, placeholder, onInputChange, onSubmit }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="p-6 border-t border-gray-100 bg-white/80 backdrop-blur-sm flex-shrink-0">
      <div className="flex space-x-4">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
          placeholder={placeholder}
          className="flex-1 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
        >
          送信
        </button>
      </div>
    </form>
  );
}