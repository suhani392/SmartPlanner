import '../styles/globals.css';
import { useEffect } from 'react';
import ChatBot from '../components/ChatBot';

export default function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const theme = sessionStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return (
        <>
            <Component {...pageProps} />
            <ChatBot />
        </>
    );
}
