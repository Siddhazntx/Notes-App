import { useState, useEffect } from 'react';
import api from '../api';
import NoteForm from './NoteForm';
import NoteCard from './NoteCard';

function Dashboard({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Fetch all notes for the authenticated user
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/notes');
      if (res.data.success) {
        setNotes(res.data.notes || []);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      } else {
        setStatusMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to fetch notes.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Show temporary feedback banner
  const showFeedback = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage({ type: '', text: '' });
    }, 4000);
  };

  // Create or Update Note handler
  const handleSaveNote = async ({ title, content }) => {
    setActionLoading(true);
    try {
      if (editingNote) {
        // Update Note
        const res = await api.put(`/api/notes/${editingNote.id}`, { title, content });
        if (res.data.success) {
          showFeedback('success', 'Note updated successfully!');
          setEditingNote(null);
          await fetchNotes();
        }
      } else {
        // Create Note
        const res = await api.post('/api/notes', { title, content });
        if (res.data.success) {
          showFeedback('success', 'Note created successfully!');
          await fetchNotes();
        }
      }
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to save note.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Note handler
  const handleDeleteNote = async (noteId) => {
    setActionLoading(true);
    try {
      const res = await api.delete(`/api/notes/${noteId}`);
      if (res.data.success) {
        showFeedback('success', 'Note deleted successfully!');
        if (editingNote && editingNote.id === noteId) {
          setEditingNote(null);
        }
        await fetchNotes();
      }
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to delete note.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-brand">
          <h1 className="app-title">Notes App</h1>
          <span className="user-badge">Logged in as: <strong>{user?.email}</strong></span>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onLogout}>
          Log Out
        </button>
      </header>

      {statusMessage.text && (
        <div className={`alert alert-${statusMessage.type} banner`}>
          {statusMessage.text}
        </div>
      )}

      <main className="dashboard-main">
        <section className="form-section">
          <NoteForm
            onSubmit={handleSaveNote}
            editingNote={editingNote}
            onCancelEdit={() => setEditingNote(null)}
            loading={actionLoading}
          />
        </section>

        <section className="notes-section">
          <div className="notes-header">
            <h2>Your Notes</h2>
            <span className="notes-count">({notes.length} {notes.length === 1 ? 'note' : 'notes'})</span>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading your notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => {
                    setEditingNote(n);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
