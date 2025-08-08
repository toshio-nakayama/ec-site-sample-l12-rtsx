import react from '@vitejs/plugin-react';
import fs from 'fs';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const host = 'devzoned.xyz';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host,
        hmr: { host },
        https: {
            key: fs.readFileSync(`/etc/letsencrypt/live/${host}/privkey.pem`),
            cert: fs.readFileSync(`/etc/letsencrypt/live/${host}/fullchain.pem`),
        }
    },
});
