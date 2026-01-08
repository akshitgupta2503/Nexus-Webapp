"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import NoteCard from '@/components/NoteCard';
import { Plus, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
    _id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
}

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState<Partial<Note>>({
        title: '',
        content: '',
        category: 'General'
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    const fetchNotes = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notes`);
            setNotes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`);
                setNotes(notes.filter((note) => note._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEdit = (note: Note) => {
        setCurrentNote(note);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentNote._id) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/notes/${currentNote._id}`, currentNote);
                setNotes(notes.map((n) => (n._id === currentNote._id ? { ...n, ...currentNote } as Note : n)));
            } else {
                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notes`, currentNote);
                setNotes([...notes, data]);
            }
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentNote({ title: '', content: '', category: 'General' });
    };

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Notes</h1>
                    <p className="text-gray-400">Manage your ideas and tasks</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary text-sm text-white"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} /> <span className="hidden sm:inline">Add Note</span>
                    </button>
                </div>
            </div>

            {filteredNotes.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                    <p className="text-gray-400 text-lg">No notes found.</p>
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="text-primary hover:underline mt-2">Clear search</button>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredNotes.map((note) => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6 text-white">
                                {isEditing ? 'Edit Note' : 'New Note'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentNote.title}
                                        onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-primary text-white"
                                        placeholder="Enter note title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select
                                        value={currentNote.category}
                                        onChange={(e) => setCurrentNote({ ...currentNote, category: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-primary text-white"
                                    >
                                        <option>General</option>
                                        <option>Work</option>
                                        <option>Personal</option>
                                        <option>Ideas</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={currentNote.content}
                                        onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-primary text-white resize-none"
                                        placeholder="Write your thoughts..."
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-400 hover:text-white mr-4"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-blue-500/20"
                                    >
                                        {isEditing ? 'Update Note' : 'Create Note'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
