import "./globals.css";
import { Montserrat } from 'next/font/google';
import NightSkyBackground from '../components/background/NightSkyBackground';

// Optimisation critique des polices pour LCP
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap', // Crucial pour éviter FOIT
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
  adjustFontFallback: true, // Réduit CLS
});

export const metadata = {
  title: "IEEE ESPRIT SB",
  description: "IEEE ESPRIT SB - Innovation et Excellence Technologique",
  keywords: "IEEE, ESPRIT, technologie, innovation, étudiants",
  authors: [{ name: "IEEE ESPRIT SB" }],
  
  // Optimisations pour le cache et la performance
  other: {
    'X-UA-Compatible': 'IE=edge',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={montserrat.className}>
      <head>
        {/* Optimisations critiques pour les ressources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Preload des ressources critiques pour LCP */}
        <link 
          rel="preload" 
          href="/images/horse_logo.png" 
          as="image" 
          type="image/png"
          fetchPriority="high"
        />
        
        {/* Optimisations viewport pour performance mobile */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" 
        />
        
        {/* Resource hints pour améliorer la performance */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        
      </head>
      <body suppressHydrationWarning={true}>
        {/* <NightSkyBackground /> */}
        {children}
      </body>
    </html>
  );
}
