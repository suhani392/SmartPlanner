import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { updateUserEmail, updatePassword } from '../utils/api';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEmail(userData.email);
        setUsername(userData.username);

        const savedTheme = sessionStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        sessionStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateUserEmail(email);
        setLoading(false);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: 'Confirmation email sent to both addresses.' });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!password) return;
        setLoading(true);
        const res = await updatePassword(password);
        setLoading(false);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPassword('');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
            <Navbar />
            <main className="container" style={{ maxWidth: '1000px', padding: '2rem' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    marginTop: '1rem'
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: 'var(--text)',
                        margin: 0
                    }}>
                        {username}'s Profile
                    </h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)'
                        }}
                    >
                        Back to Dashboard
                    </button>
                </header>

                {message.text && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: message.type === 'error' ? '#ef4444' : '#22c55e',
                        border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                        fontWeight: '500'
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Account Settings</h2>

                        {/* Account Details */}
                        <section className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', marginTop: 0 }}>Basic Information</h3>
                            <form onSubmit={handleUpdateEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        disabled
                                        style={{
                                            backgroundColor: 'var(--bg)',
                                            opacity: 0.8,
                                            cursor: 'not-allowed',
                                            border: '1px solid var(--border)',
                                            padding: '0.8rem'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ border: '1px solid var(--border)', padding: '0.8rem' }}
                                    />
                                </div>
                                <button className="btn" type="submit" disabled={loading} style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    display: 'inline-block',
                                    width: 'fit-content',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}>
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </form>
                        </section>

                        {/* Security Settings */}
                        <section className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', marginTop: 0 }}>Security</h3>
                            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>New Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        style={{ border: '1px solid var(--border)', padding: '0.8rem' }}
                                    />
                                </div>
                                <button className="btn" type="submit" disabled={loading} style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    display: 'inline-block',
                                    width: 'fit-content',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}>
                                    {loading ? 'Updating...' : 'Change Password'}
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Preferences Sidebar style */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Preferences</h2>
                        <section className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: 0 }}>Appearance</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Customize your interface theme.
                            </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'var(--bg)',
                                border: '1px solid var(--border)',
                            }}>
                                <span style={{ fontWeight: '500' }}>Dark Mode</span>
                                <button
                                    onClick={handleThemeToggle}
                                    style={{
                                        backgroundColor: theme === 'dark' ? 'var(--primary)' : '#cbd5e1',
                                        border: 'none',
                                        width: '48px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 3px'
                                    }}
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        left: theme === 'dark' ? '27px' : '3px',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }} />
                                </button>
                            </div>
                        </section>

                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px dashed var(--border)',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                More settings coming soon!
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
