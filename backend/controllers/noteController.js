const pool = require("../config/db");

// Get all notes for the authenticated user (newest first)
const getNotes = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            notes: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// Create a new note
const createNote = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        if (typeof title !== "string" || typeof content !== "string") {
            return res.status(400).json({
                success: false,
                message: "Title and content must be strings"
            });
        }

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent) {
            return res.status(400).json({
                success: false,
                message: "Title and content cannot be empty"
            });
        }

        const result = await pool.query(
            `INSERT INTO notes (user_id, title, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, trimmedTitle, trimmedContent]
        );

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            note: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// Update an existing note by ID (user ownership enforced in SQL)
const updateNote = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        if (typeof title !== "string" || typeof content !== "string") {
            return res.status(400).json({
                success: false,
                message: "Title and content must be strings"
            });
        }

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent) {
            return res.status(400).json({
                success: false,
                message: "Title and content cannot be empty"
            });
        }

        const result = await pool.query(
            `UPDATE notes
             SET title = $1, content = $2, updated_at = NOW()
             WHERE id = $3 AND user_id = $4
             RETURNING *`,
            [trimmedTitle, trimmedContent, noteId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found or unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// Delete a note by ID (user ownership enforced in SQL)
const deleteNote = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;

        const result = await pool.query(
            "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id",
            [noteId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found or unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
};
