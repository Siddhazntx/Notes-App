function NoteCard({ note, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h4 className="note-title">{note.title}</h4>
        <span className="note-date">{formatDate(note.created_at)}</span>
      </div>
      <p className="note-content">{note.content}</p>
      <div className="note-card-actions">
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => onEdit(note)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
