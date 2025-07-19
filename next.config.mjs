/** @type {import('next').NextConfig} */
const nextConfig = {
    // Development-specific settings
    productionBrowserSourceMaps: false,
    generateBuildId: () => 'dev-build',
    
    // Configuration des indicateurs de développement
    devIndicators: {
        position: 'bottom-right',
    },
    
    // Configuration pour les origines de développement autorisées
    allowedDevOrigins: [
        '192.168.1.12',
        'localhost',
        '127.0.0.1',
        '0.0.0.0'
    ],
    
    // Optimisations expérimentales essentielles avec Turbopack
    experimental: {
        optimizePackageImports: ['framer-motion', 'react-icons', 'typewriter-effect'],
    },

    // Configuration Turbopack (stable)
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },

    // Configuration d'images optimisée pour votre site
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 1, // Désactive le cache agressif pour le dev
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        domains: [],
        remotePatterns: [],
        unoptimized: false,
    },

    // Headers de cache adaptés aux bonnes pratiques
    async headers() {
        return [
            {
                source: '/assets/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=1, must-revalidate', // Désactive le cache agressif
                    },
                ],
            },
            {
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=1, must-revalidate',
                    },
                ],
            },
            {
                source: '/icons/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=1, must-revalidate',
                    },
                ],
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=1, must-revalidate',
                    },
                ],
            },
        ];
    },

    // Redirections pour les anciens chemins d'assets
    async redirects() {
        return [
            {
                source: '/public/assets/:path*',
                destination: '/assets/:path*',
                permanent: true,
            },
            {
                source: '/public/images/:path*',
                destination: '/images/:path*',
                permanent: true,
            },
            {
                source: '/public/icons/:path*',
                destination: '/icons/:path*',
                permanent: true,
            },
        ];
    },

    // Webpack minimal pour votre projet
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            // Bundle splitting simple pour les grosses librairies
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    framerMotion: {
                        test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                        name: 'framer-motion',
                        priority: 30,
                    },
                    reactIcons: {
                        test: /[\\/]node_modules[\\/]react-icons[\\/]/,
                        name: 'react-icons',
                        priority: 20,
                    },
                },
            };
        }
        return config;
    },
};

export default nextConfig;
