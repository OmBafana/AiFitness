import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { geminiService, ChatMessage } from '../services/geminiService';
import { 
  Send, 
  Bot, 
  User, 
  Dumbbell,
  Apple,
  Target,
  TrendingUp,
  MessageCircle,
  Sparkles
} from 'lucide-react';

interface Message extends ChatMessage {
  id: string;
  timestamp: Date;
}

const AIChat = () => {
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI fitness coach. I'm here to help you with workout plans, nutrition advice, form corrections, and motivation. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickTopics = [
    { icon: Dumbbell, text: "Create a workout plan for me", category: "workout" },
    { icon: Apple, text: "What should I eat post-workout?", category: "nutrition" },
    { icon: Target, text: "How can I improve my form?", category: "form" },
    { icon: TrendingUp, text: "Track my progress", category: "progress" }
  ];

  const scrollToEnd = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToEnd();
  }, [chatMessages]);

  const sendUserMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setAiThinking(true);

    try {
      // Convert messages to the format expected by geminiService
      const conversationHistory: ChatMessage[] = [...chatMessages, newUserMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const aiReply = await geminiService.chatWithAI(conversationHistory, user);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiReply,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setAiThinking(false);
    }
  };

  const useQuickTopic = (question: string) => {
    setUserInput(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in to chat with AI coach</h2>
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Fitness Coach</h1>
          <p className="text-slate-600">
            Chat with your personal AI trainer for guidance, motivation, and expert advice.
          </p>
        </div>

        <div className="chat-container bg-white rounded-2xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="chat-top p-6 border-b border-slate-200">
            <div className="coach-info flex items-center">
              <div className="coach-avatar p-2 bg-emerald-100 rounded-full mr-3">
                <Bot className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="coach-details">
                <h3 className="coach-name font-semibold text-slate-900">AI Fitness Coach</h3>
                <p className="coach-status text-sm text-slate-600">Online • Ready to help</p>
              </div>
              <div className="coach-badge ml-auto">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`message-bubble flex max-w-xs lg:max-w-md ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`message-avatar flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`avatar-circle w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                  </div>
                  <div className={`message-content px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <p className="message-text text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`message-time text-xs mt-1 ${
                      message.role === 'user' ? 'text-emerald-200' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {aiThinking && (
              <div className="thinking-indicator flex justify-start">
                <div className="thinking-bubble flex">
                  <div className="thinking-avatar flex-shrink-0 mr-3">
                    <div className="thinking-circle w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-slate-600" />
                    </div>
                  </div>
                  <div className="thinking-content px-4 py-2 rounded-2xl bg-slate-100">
                    <div className="thinking-dots flex space-x-1">
                      <div className="thinking-dot w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="thinking-dot w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="thinking-dot w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="quick-topics p-4 border-t border-slate-200">
            <div className="topics-grid grid grid-cols-2 gap-2 mb-4">
              {quickTopics.map((question, index) => (
                <button
                  key={index}
                  onClick={() => useQuickTopic(question.text)}
                  className="topic-button flex items-center p-2 text-sm bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
                >
                  <question.icon className="h-4 w-4 mr-2 text-emerald-600" />
                  <span className="topic-text text-slate-700 truncate">{question.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="chat-input p-4 border-t border-slate-200">
            <div className="input-wrapper flex space-x-3">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyDown}
                placeholder="Ask me anything about fitness, nutrition, or workouts..."
                className="message-input flex-1 resize-none border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={1}
                disabled={aiThinking}
              />
              <button
                onClick={sendUserMessage}
                disabled={!userInput.trim() || aiThinking}
                className="send-button px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;