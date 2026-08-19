import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Bonjour ! 🎓 Je suis l’Assistant Virtuel de l’**IUM-MORAVE** (Agrément ESU N°83/MINESU).\n\nComment puis-je vous aider aujourd’hui ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: data.reply || 'Désolé, une erreur est survenue.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Erreur API');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'bot',
          text: 'Merci pour votre question ! Pour toute information complémentaire, écrivez directement à secretariat@iumorave-ac.org.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: '🎓 Facultés LMD', text: 'Quelles sont les facultés et filières de l’IUM-MORAVE ?' },
    { label: '📝 Admissions 2026', text: 'Comment s’inscrire et quelles sont les conditions d’admission ?' },
    { label: '⚖️ Agrément ESU', text: 'Quelle est la reconnaissance officielle et l’agrément de l’université ?' },
    { label: '📍 Localisation', text: 'Où est situé le campus de l’IUM-MORAVE ?' },
    { label: '📧 Contact Secrétariat', text: 'Comment contacter le secrétariat académique ?' }
  ];

  return (
    <>
      {/* BOUTON FLOTTANT D'OUVERTURE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir l'assistant virtuel IUM-MORAVE"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: '1px solid #3b82f6',
            borderRadius: '9999px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>🤖</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#60a5fa' }}>Assistant IA</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#22c55e', fontSize: '0.6rem' }}>●</span> IUM-MORAVE Bot
            </div>
          </div>
        </button>
      )}

      {/* FENÊTRE DU CHATBOT */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 48px)',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '20px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            animation: 'fadeInUp 0.3s ease-out forwards'
          }}
        >
          {/* EN-TÊTE DU CHATBOT */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem'
                }}
              >
                🎓
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  Assistant IA IUM-MORAVE
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                  ✓ Agrément ESU N°83/MINESU
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le chat"
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '8px'
              }}
            >
              ✕
            </button>
          </div>

          {/* LISTE DES MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#090d16'
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 14px',
                    borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: m.sender === 'user' ? '#2563eb' : '#1e293b',
                    color: m.sender === 'user' ? '#ffffff' : '#e2e8f0',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {m.text}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                  {m.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.8rem' }}>
                <span>🤖 L'assistant réfléchit...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* CHIPS DE SUGGESTION RAPIDE */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#0f172a',
              borderTop: '1px solid #1e293b',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qp.text)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#93c5fd',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* BARRE DE SAISIE */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px',
              backgroundColor: '#0f172a',
              borderTop: '1px solid #334155',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Posez votre question à l'IA..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: loading || !input.trim() ? '#334155' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </>
  );
}
