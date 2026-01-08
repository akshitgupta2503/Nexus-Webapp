const Note = require('../models/Note');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content) {
        res.status(400).json({ message: 'Please fill in all fields' });
        return;
    }

    const note = new Note({
        user: req.user._id,
        title,
        content,
        category,
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
};

// @desc    Get a note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note) {
        // Ensure user owns the note
        if (note.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        res.json(note);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
    const { title, content, category } = req.body;

    const note = await Note.findById(req.params.id);

    if (note) {
        if (note.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        note.title = title || note.title;
        note.content = content || note.content;
        note.category = category || note.category;

        const updatedNote = await note.save();
        res.json(updatedNote);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note) {
        if (note.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
};

module.exports = {
    getNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
};
