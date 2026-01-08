"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
    email: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL + '/users';

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            if (typeof window !== 'undefined') {
                const adminData = localStorage.getItem('userInfo');
                if (adminData) {
                    const userData = JSON.parse(adminData);
                    setUser(userData);
                    // Set axios default header
                    if (userData.token) {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
                    }
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                `${API_URL}/login`,
                { email, password },
                config
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            router.push('/dashboard');
        } catch (err: any) {
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;
            setError(message);
            throw new Error(message);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setError(null);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                API_URL,
                { name, email, password },
                config
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            router.push('/dashboard');
        } catch (err: any) {
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;
            setError(message);
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login');
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
