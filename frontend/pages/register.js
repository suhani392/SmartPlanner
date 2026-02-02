import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { registerUser } from '../utils/api';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const result = await registerUser(formData);
            if (result.id) {
                sessionStorage.setItem('user', JSON.stringify({ email: formData.email, username: formData.username }));
                sessionStorage.setItem('userId', result.id.toString());
                alert("Registration Successful!");
                router.push('/dashboard');
            } else {
                alert(result.error || "Registration failed");
            }
        } catch (err) {
            alert("Backend server error. Check database connection.");
        }
    };

    return (
        <div>
            <Navbar />
            <main className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
                <div className="card">
                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create an Account</h2>
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="john123"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <button className="btn" type="submit" style={{ padding: '0.8rem', marginTop: '1rem' }}>Register</button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link href="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
