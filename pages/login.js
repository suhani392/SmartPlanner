import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { loginUser } from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await loginUser({ email, password });
            if (result.id) {
                sessionStorage.setItem('user', JSON.stringify({ email: result.email, username: result.username }));
                sessionStorage.setItem('userId', result.id.toString());
                router.push('/dashboard');
            } else {
                alert(result.error || "Invalid login credentials");
            }
        } catch (err) {
            alert("Backend server is not responding. Ensure node index.js is running.");
        }
    };

    return (
        <div>
            <Navbar />
            <main className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
                <div className="card">
                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login to Your Account</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="john123"
                                required
                                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <button className="btn" type="submit" style={{ padding: '0.8rem', marginTop: '1rem' }}>Login</button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link href="/register" style={{ color: 'var(--primary)' }}>Register</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
