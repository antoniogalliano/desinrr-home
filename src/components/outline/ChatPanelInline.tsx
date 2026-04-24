'use client';

import { useState, useRef, useEffect } from 'react';
import { useFlowStore } from '@/stores/flowStore';
import { ChatMessage } from '@/components/chat/ChatMessage';

const OUTLINE_WELCOME_MESSAGE = `Here's your complete outline! Want to make any changes? You can:

• Change chapter titles
• Reorder chapters
• Combine or split chapters
• Adjust micro-story openers
• Modify what each chapter covers

Let me know what to adjust, or if you're happy just type which book you want to create!`;

export function ChatPanelInline() {
  const messages = useFlowStore((s) => s.messages);
  const addMessage = useFlowStore((s) => s.addMessage);
  const outlineWelcomeSent = useFlowStore((s) => s.outlineWelcomeSent);
  const setOutlineWelcomeSent = useFlowStore((s) => s.setOutlineWelcomeSent);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const filteredMessages = messages.filter(
    (m) => m.type === 'text' || m.type === 'structured'
  );

  // Add welcome message once (survives component remounts via store flag)
  useEffect(() => {
    if (!outlineWelcomeSent) {
      setOutlineWelcomeSent(true);
      addMessage({
        role: 'ai',
        content: OUTLINE_WELCOME_MESSAGE,
        type: 'text',
      });
    }
  }, [outlineWelcomeSent, setOutlineWelcomeSent, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages.length]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    addMessage({ role: 'user', content: trimmed, type: 'text' });
    setInputValue('');
    // Mock AI response after brief delay
    setTimeout(() => {
      addMessage({
        role: 'ai',
        content: "I'll update the outline based on your feedback. Give me a moment...",
        type: 'text',
      });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-80 flex-shrink-0 h-full bg-white border-r border-border-light flex flex-col relative overflow-hidden">
      {/* Gradient background overlay — matches chat steps */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 50% -5%, rgba(57, 169, 229, 0.14) 0%, transparent 60%),
          radial-gradient(ellipse at 0% 100%, rgba(131, 23, 255, 0.10) 0%, transparent 50%)
        `
      }} />
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0 relative z-10">
        {filteredMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="flex-shrink-0 border-t border-border-light/50 px-3 py-2.5 relative z-10">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask to make changes..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-placeholder resize-none focus:outline-none leading-5 max-h-[80px]"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 flex-shrink-0 ${inputValue.trim()
              ? 'gradient-bg text-white cursor-pointer'
              : 'bg-transparent text-text-tertiary cursor-not-allowed'
              }`}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3.5 9L9 3.5L14.5 9M9 3.5V14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
