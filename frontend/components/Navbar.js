import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link href="/">
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', cursor: 'pointer' }}>
                        SmartPlanner
                    </span>
                </Link>
            </div>
            <div className="links">
                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard" style={{ margin: '0 10px' }}>Dashboard</Link>
                        <Link href="/tasks" style={{ margin: '0 10px' }}>Tasks</Link>
                        <Link href="/timetable" style={{ margin: '0 10px' }}>Planner</Link>
                        <button
                            onClick={handleLogout}
                            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', marginLeft: '20px', fontWeight: 'bold' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ margin: '0 10px' }}>Login</Link>
                        <Link href="/register" style={{ marginLeft: '10px', fontWeight: 'bold' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
