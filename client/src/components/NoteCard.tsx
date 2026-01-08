"use client";

import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

interface Note {
    _id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
}

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-xl relative group"
        >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(note)}
                    className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-full transition-colors"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={() => onDelete(note._id)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <span className="inline-block px-2 py-1 bg-slate-800 text-xs text-slate-300 rounded-md mb-3">
                {note.category}
            </span>
            <h3 className="text-xl font-bold mb-2 text-gray-100">{note.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-3 mb-4">{note.content}</p>
            <p className="text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()}
            </p>
        </motion.div>
    );
};

export default NoteCard;
