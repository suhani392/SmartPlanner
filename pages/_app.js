import '../styles/globals.css';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const theme = sessionStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return <Component {...pageProps} />;
}
