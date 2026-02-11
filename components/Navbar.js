import Link from 'next/link';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        setIsLoggedIn(!!user);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userId');
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                        src={logo.src || logo}
                        alt="Logo"
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '80%',
                            objectFit: 'cover'
                        }}
                    />
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', cursor: 'pointer' }}>
                        SmartPlanner
                    </span>
                </Link>
            </div>
            <div className="nav-links">
                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard" className="nav-link">Dashboard</Link>
                        <Link href="/tasks" className="nav-link">Tasks</Link>
                        <Link href="/timetable" className="nav-link">Planner</Link>
                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="nav-link">Login</Link>
                        <Link href="/register" className="register-btn">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
