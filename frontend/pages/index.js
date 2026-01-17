import Navbar from '../components/Navbar';

export default function Home() {
    return (
        <div>
            <Navbar />
            <main className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                    Stop Overworking, <br />
                    <span style={{ color: 'var(--primary)' }}>Start Planning Smarter</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Automatically generate your daily timetable based on task priorities and deadlines.
                    The perfect tool for busy students and professionals.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started Free</button>
                    <button className="btn" style={{ background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        Learn More
                    </button>
                </div>
            </main>
        </div>
    );
}
