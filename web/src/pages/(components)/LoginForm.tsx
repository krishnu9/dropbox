import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useLoginStore } from '~/store/loginStore';

const LoginForm = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const {isLoggedIn, login, logout} = useLoginStore();

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(name, email, password);
        fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                login(data.token)
                router.push('/')
            } else
            setError(data.message)
        })
        .catch(error => {
            setError(error.message);
        });
    };

    const register = () => {
        fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                login(data.token)
                router.push('/')
            } else
            setError(data.message)
        })
        .catch(error => {
            setError(error.message);
        });

    }

    const handleRegisterRedirect = async () => {
        if (router.pathname === '/auth/register') {
            await register();
        } else router.push('/auth/register');
    }
    
    const handleLoginRedirect = () => {
        router.push('/auth/login');
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            {router.pathname === '/auth/register' && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {error && (
                <div className="mb-4 text-red-500 text-sm">
                    {error}
                </div>
            )}
            {router.pathname === '/auth/login' && (
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Login
            </button>
            )}
            <button type="button" onClick={handleRegisterRedirect} className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Register
            </button>
            {router.pathname === '/auth/register' && (
            <button type="button" onClick={handleLoginRedirect} className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Back to Login
            </button>
            )}
        </form>
    );
};

export default LoginForm;