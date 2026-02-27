import './globals.css'

export const metadata = {
  title: 'Flowi — Control financiero para jóvenes',
  description: 'Toma el control de tu dinero con Flowi. Registra gastos, fija metas de ahorro y visualiza tu salud financiera.',
  keywords: 'finanzas personales, control de gastos, ahorro, presupuesto',
  manifest: '/manifest.json',
  themeColor: '#080810',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Flowi',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />

        {/* PWA / iOS Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Flowi" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#080810" />

        {/* iOS icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>{children}</body>
    </html>
  )
}
