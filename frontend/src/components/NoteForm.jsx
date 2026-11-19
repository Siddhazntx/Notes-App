import { useState, useEffect } from 'react';

function NoteForm({ onSubmit, editingNote, onCancelEdit, loading }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Populate form fields when editing a note
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setError('');
    } else {
      setTitle('');
      setContent('');
      setError('');
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Both title and content are required.');
      return;
    }

    onSubmit({ title: trimmedTitle, content: trimmedContent });

    if (!editingNote) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="note-form-card">
      <h3 className="form-title">{editingNote ? 'Edit Note' : 'Create a New Note'}</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            rows="4"
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : editingNote ? 'Update Note' : 'Add Note'}
          </button>
          {editingNote && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default NoteForm;
