import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import axios from 'axios';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

// Configure Axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Set initial CSRF token if present
const initialToken = typeof document !== 'undefined'
    ? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content
    : null;
if (initialToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = initialToken;
}

// Request interceptor to ensure fresh CSRF token is attached to every request
axios.interceptors.request.use((config) => {
    if (typeof document !== 'undefined') {
        const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content;
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
    }
    return config;
});

// Keep meta csrf-token in sync with Inertia props on navigation
router.on('navigate', (event) => {
    const token = (event.detail.page.props as any)?.csrf_token;
    if (token) {
        const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        if (meta) {
            meta.content = token;
        }
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
});

const appName = 'Level Up Accounting';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
