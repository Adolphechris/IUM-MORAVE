import React, { useState, useEffect } from 'react';
import { InstitutionalMessage } from '../pages/api/admin/messages';

type Props = {
  token: string;
};

type Toast = {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
};

export default function AdminMessaging({ token }: Props) {
  const [messages, setMessages] = useState<InstitutionalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'starred' | 'sent' | 'archive'>('inbox');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMessage, setActiveMessage] = useState<InstitutionalMessage | null>(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeSender, setComposeSender] = useState('secretariat@iumorave-ac.org');
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Inline Reply State
  const [replyText, setReplyText] = useState('');
  const [replySender, setReplySender] = useState('secretariat@iumorave-ac.org');
  const [isReplying, setIsReplying] = useState(false);

  function addToast(type: 'success' | 'info' | 'warning', message: string) {
    const id = 'toast-' + Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [token]);

  async function updateStatus(id: string, updates: Partial<InstitutionalMessage>) {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, ...updates })
      });
      if (res.ok) {
        setMessages(prev =>
          prev.map(m => (m.id === id ? { ...m, ...updates } : m))
        );
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage(prev => (prev ? { ...prev, ...updates } : null));
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  }

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!composeRecipient || !composeBody) {
      addToast('warning', 'Veuillez remplir le destinataire et le message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'send',
          senderAccount: composeSender,
          recipient: composeRecipient,
          subject: composeSubject,
          message: composeBody
        })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', `E-mail transmis avec succès depuis ${composeSender} vers ${composeRecipient} !`);
        setIsComposeOpen(false);
        setComposeRecipient('');
        setComposeSubject('');
        setComposeBody('');
        fetchMessages();
      } else {
        addToast('warning', data.error || 'Erreur lors de l’envoi de l’e-mail.');
      }
    } catch (err) {
      addToast('warning', 'Échec de transmission du message.');
    } finally {
      setLoading(false);
    }
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!activeMessage || !replyText) return;

    setIsReplying(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'reply',
          replyToId: activeMessage.id,
          senderAccount: replySender,
          recipient: activeMessage.email,
          subject: 'Re: ' + activeMessage.subject,
          message: replyText
        })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', `Réponse transmise depuis ${replySender} vers ${activeMessage.email} !`);
        setReplyText('');
        fetchMessages();
      } else {
        addToast('warning', data.error || 'Erreur lors de l’envoi de la réponse.');
      }
    } catch (err) {
      addToast('warning', 'Erreur réseau lors de la réponse.');
    } finally {
      setIsReplying(false);
    }
  }

  // Filter messages
  const filteredMessages = messages.filter(m => {
    // Folder filter
    if (selectedFolder === 'starred' && !m.isStarred) return false;
    if (selectedFolder === 'sent' && m.folder !== 'sent') return false;
    if (selectedFolder === 'archive' && m.folder !== 'archive') return false;
    if (selectedFolder === 'inbox' && m.folder === 'archive') return false;

    // Account filter
    if (selectedAccount !== 'all' && m.recipientAccount !== selectedAccount) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      return matchName || matchEmail || matchSubject || matchMsg;
    }

    return true;
  });

  const unreadCount = messages.filter(m => m.status === 'NOUVEAU' && m.folder !== 'archive').length;

  return (
    <div className="gmail-container">
      {/* ── TOAST NOTIFICATION CONTAINER ──────────────────────────── */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="toast-text">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ── BARRE SUPÉRIEURE DE RECHERCHE ET COMPTES ──────────────── */}
      <div className="gmail-header">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher dans les messages, sujets, expéditeurs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="account-selector">
          <span className="account-label">Compte :</span>
          <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
            <option value="all">✉️ Tous les comptes (Vue globale)</option>
            <option value="secretariat@iumorave-ac.org">🏛️ secretariat@iumorave-ac.org (Principal)</option>
            <option value="contact@iumorave-ac.org">📩 contact@iumorave-ac.org (Général)</option>
          </select>
        </div>

        <button className="btn-refresh" onClick={fetchMessages} title="Actualiser la boîte">
          🔄 {loading ? 'Chargement…' : 'Actualiser'}
        </button>
      </div>

      {/* ── CORPS DE LA MESSAGERIE (SIDEBAR + LISTE/MESSAGE) ──────── */}
      <div className="gmail-body">
        {/* SIDEBAR GMAIL */}
        <aside className="gmail-sidebar">
          <button className="btn-compose" onClick={() => setIsComposeOpen(true)}>
            <span className="compose-icon">✏️</span>
            <span className="compose-text">Nouveau message</span>
          </button>

          <nav className="folder-nav">
            <button
              className={`folder-item ${selectedFolder === 'inbox' ? 'active' : ''}`}
              onClick={() => { setSelectedFolder('inbox'); setActiveMessage(null); }}
            >
              <span className="folder-icon">📥</span>
              <span className="folder-name">Boîte de réception</span>
              {unreadCount > 0 && <span className="badge-unread">{unreadCount}</span>}
            </button>

            <button
              className={`folder-item ${selectedFolder === 'starred' ? 'active' : ''}`}
              onClick={() => { setSelectedFolder('starred'); setActiveMessage(null); }}
            >
              <span className="folder-icon">⭐</span>
              <span className="folder-name">Messages suivis</span>
            </button>

            <button
              className={`folder-item ${selectedFolder === 'sent' ? 'active' : ''}`}
              onClick={() => { setSelectedFolder('sent'); setActiveMessage(null); }}
            >
              <span className="folder-icon">📤</span>
              <span className="folder-name">Envoyés</span>
            </button>

            <button
              className={`folder-item ${selectedFolder === 'archive' ? 'active' : ''}`}
              onClick={() => { setSelectedFolder('archive'); setActiveMessage(null); }}
            >
              <span className="folder-icon">📁</span>
              <span className="folder-name">Archives</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="active-account-badge">
              <span className="dot-online"></span>
              <div>
                <strong>Secrétariat Général</strong>
                <p>secretariat@iumorave-ac.org</p>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL (LISTE OU DETAIL) */}
        <section className="gmail-content">
          {activeMessage ? (
            /* ── VUE DETAIL MESSAGE ────────────────────────────────── */
            <div className="message-detail-view">
              <div className="detail-toolbar">
                <button className="btn-back" onClick={() => setActiveMessage(null)}>
                  ← Retour à la liste
                </button>
                <div className="detail-actions">
                  <button
                    className={`btn-star ${activeMessage.isStarred ? 'starred' : ''}`}
                    onClick={() => updateStatus(activeMessage.id, { isStarred: !activeMessage.isStarred })}
                  >
                    {activeMessage.isStarred ? '⭐ Suivi' : '☆ Suivre'}
                  </button>
                  <button
                    className="btn-archive"
                    onClick={() => {
                      updateStatus(activeMessage.id, { folder: 'archive' });
                      addToast('info', 'Message archivé.');
                      setActiveMessage(null);
                    }}
                  >
                    📁 Archiver
                  </button>
                </div>
              </div>

              <div className="message-card-detail">
                <h2 className="detail-subject">{activeMessage.subject}</h2>

                <div className="sender-meta-bar">
                  <div className="sender-avatar">
                    {activeMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="sender-info">
                    <strong>{activeMessage.name}</strong> &lt;{activeMessage.email}&gt;
                    <p className="account-tag">
                      Destinataire : <code>{activeMessage.recipientAccount}</code>
                    </p>
                  </div>
                  <div className="date-tag">
                    {new Date(activeMessage.createdAt).toLocaleString('fr-FR')}
                  </div>
                </div>

                <div className="message-text-body">
                  {activeMessage.message.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {/* FIL DES RÉPONSES EXISTANTES */}
                {activeMessage.replies && activeMessage.replies.length > 0 && (
                  <div className="replies-thread">
                    <h4>💬 Réponses précédentes :</h4>
                    {activeMessage.replies.map(rep => (
                      <div key={rep.id} className="reply-bubble">
                        <div className="reply-header">
                          <strong>{rep.sender}</strong>
                          <span>{new Date(rep.sentAt).toLocaleString('fr-FR')}</span>
                        </div>
                        <p>{rep.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* FORMULAIRE DE RÉPONSE RAPIDE */}
                <div className="quick-reply-box">
                  <h3>↩️ Répondre à ce message</h3>
                  <form onSubmit={sendReply}>
                    <div className="reply-sender-select">
                      <label>Expéditeur :</label>
                      <select value={replySender} onChange={e => setReplySender(e.target.value)}>
                        <option value="secretariat@iumorave-ac.org">secretariat@iumorave-ac.org (Secrétariat)</option>
                        <option value="contact@iumorave-ac.org">contact@iumorave-ac.org (Contact)</option>
                      </select>
                    </div>

                    <textarea
                      placeholder={`Rédiger votre réponse officielle à ${activeMessage.email}...`}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      required
                    ></textarea>

                    <button type="submit" className="btn-send-reply" disabled={isReplying}>
                      {isReplying ? 'Envoi en cours…' : '🚀 Envoyer la réponse officielle'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* ── VUE LISTE MESSAGES ────────────────────────────────── */
            <div className="message-list-view">
              <div className="list-toolbar">
                <span className="count-info">
                  {filteredMessages.length} message(s) trouvé(s)
                </span>
              </div>

              {filteredMessages.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>Aucun message dans ce dossier.</p>
                </div>
              ) : (
                <div className="messages-rows">
                  {filteredMessages.map(msg => {
                    const isUnread = msg.status === 'NOUVEAU';
                    return (
                      <div
                        key={msg.id}
                        className={`message-row ${isUnread ? 'unread' : ''}`}
                        onClick={() => {
                          setActiveMessage(msg);
                          if (isUnread) updateStatus(msg.id, { status: 'LU' });
                        }}
                      >
                        <button
                          className={`star-btn ${msg.isStarred ? 'starred' : ''}`}
                          onClick={e => {
                            e.stopPropagation();
                            updateStatus(msg.id, { isStarred: !msg.isStarred });
                          }}
                        >
                          {msg.isStarred ? '⭐' : '☆'}
                        </button>

                        <div className="msg-sender">
                          <strong>{msg.name}</strong>
                          <span className="account-pill">{msg.recipientAccount.split('@')[0]}</span>
                        </div>

                        <div className="msg-subject-snippet">
                          <span className="msg-subject">{msg.subject}</span>
                          <span className="msg-snippet"> — {msg.message.substring(0, 70)}...</span>
                        </div>

                        <div className="msg-date">
                          {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ── COMPOSE MODAL (NOUVEAU MESSAGE) ───────────────────────── */}
      {isComposeOpen && (
        <div className="compose-modal-overlay">
          <div className="compose-modal">
            <div className="compose-header">
              <h3>✉️ Nouveau message institutionnel</h3>
              <button className="close-btn" onClick={() => setIsComposeOpen(false)}>✕</button>
            </div>

            <form onSubmit={sendEmail} className="compose-form">
              <div className="form-group">
                <label>Expéditeur :</label>
                <select value={composeSender} onChange={e => setComposeSender(e.target.value)}>
                  <option value="secretariat@iumorave-ac.org">🏛️ secretariat@iumorave-ac.org (Secrétariat - Principal)</option>
                  <option value="contact@iumorave-ac.org">📩 contact@iumorave-ac.org (Contact Général)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Destinataire :</label>
                <input
                  type="email"
                  placeholder="adresse.destinataire@domaine.com"
                  value={composeRecipient}
                  onChange={e => setComposeRecipient(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Objet :</label>
                <input
                  type="text"
                  placeholder="Sujet de la communication officielle"
                  value={composeSubject}
                  onChange={e => setComposeSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <textarea
                  placeholder="Rédigez votre message officiel..."
                  value={composeBody}
                  onChange={e => setComposeBody(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="compose-footer">
                <button type="submit" className="btn-send" disabled={loading}>
                  🚀 Envoyer l’e-mail
                </button>
                <button type="button" className="btn-cancel" onClick={() => setIsComposeOpen(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STYLES CSS GMAIL-STYLE ─────────────────────────────────── */}
      <style jsx>{`
        .gmail-container {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          overflow: hidden;
          font-family: Inter, system-ui, sans-serif;
          margin-top: 1rem;
        }

        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .toast-card {
          background: #1e293b;
          color: #fff;
          padding: 12px 18px;
          border-radius: 8px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .gmail-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .search-bar {
          flex: 1;
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 24px;
          padding: 8px 16px;
          gap: 10px;
        }
        .search-bar input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
        }
        .clear-search {
          border: none;
          background: transparent;
          cursor: pointer;
          color: #94a3b8;
        }
        .account-selector select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-weight: 600;
          color: #0f172a;
        }
        .btn-refresh {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #fff;
          cursor: pointer;
          font-weight: 600;
        }

        .gmail-body {
          display: flex;
          min-height: 580px;
        }

        .gmail-sidebar {
          width: 240px;
          background: #f1f5f9;
          border-right: 1px solid #e2e8f0;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .btn-compose {
          background: #0284c7;
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 24px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
          transition: transform 0.15s;
        }
        .btn-compose:hover {
          transform: translateY(-1px);
          background: #0369a1;
        }

        .folder-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .folder-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 20px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          color: #334155;
          text-align: left;
          width: 100%;
        }
        .folder-item.active {
          background: #e0f2fe;
          color: #0369a1;
        }
        .badge-unread {
          margin-left: auto;
          background: #ef4444;
          color: #fff;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #cbd5e1;
        }
        .active-account-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }
        .active-account-badge p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }
        .dot-online {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
        }

        .gmail-content {
          flex: 1;
          background: #fff;
        }

        .message-list-view {
          display: flex;
          flex-direction: column;
        }
        .list-toolbar {
          padding: 12px 20px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.85rem;
          color: #64748b;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }
        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
        }

        .message-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 20px;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: background 0.15s;
        }
        .message-row:hover {
          background: #f8fafc;
        }
        .message-row.unread {
          background: #f0f9ff;
          font-weight: 700;
        }
        .star-btn {
          border: none;
          background: transparent;
          font-size: 1.2rem;
          cursor: pointer;
        }
        .msg-sender {
          width: 200px;
          display: flex;
          flex-direction: column;
        }
        .account-pill {
          font-size: 0.7rem;
          background: #e2e8f0;
          color: #475569;
          padding: 1px 6px;
          border-radius: 4px;
          width: fit-content;
        }
        .msg-subject-snippet {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .msg-snippet {
          color: #64748b;
          font-weight: normal;
        }
        .msg-date {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .message-detail-view {
          padding: 24px;
        }
        .detail-toolbar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .btn-back {
          border: 1px solid #cbd5e1;
          background: #fff;
          padding: 8px 14px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .detail-actions {
          display: flex;
          gap: 8px;
        }
        .btn-star, .btn-archive {
          border: 1px solid #cbd5e1;
          background: #fff;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
        }
        .message-card-detail {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }
        .detail-subject {
          margin-top: 0;
          font-size: 1.4rem;
          color: #0f172a;
        }
        .sender-meta-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 20px;
        }
        .sender-avatar {
          width: 42px;
          height: 42px;
          background: #0284c7;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
        }
        .sender-info code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .date-tag {
          margin-left: auto;
          font-size: 0.85rem;
          color: #64748b;
        }
        .message-text-body {
          line-height: 1.6;
          color: #334155;
          margin-bottom: 30px;
        }

        .replies-thread {
          background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .reply-bubble {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
          margin-top: 8px;
        }
        .reply-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 6px;
        }

        .quick-reply-box {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        .quick-reply-box textarea {
          width: 100%;
          min-height: 100px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          margin: 10px 0;
          font-family: inherit;
        }
        .btn-send-reply {
          background: #0284c7;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .compose-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .compose-modal {
          background: #fff;
          width: 600px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .compose-header {
          background: #0f172a;
          color: #fff;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .compose-header h3 { margin: 0; font-size: 1.1rem; }
        .close-btn { background: transparent; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; }

        .compose-form {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #475569;
        }
        .form-group input, .form-group select, .form-group textarea {
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-family: inherit;
        }
        .form-group textarea {
          min-height: 140px;
          resize: vertical;
        }
        .compose-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        .btn-send {
          background: #0284c7;
          color: #fff;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid #cbd5e1;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
