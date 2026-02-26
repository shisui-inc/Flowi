import './globals.css'

export const metadata = {
  title: 'Flowi — Control financiero para jóvenes',
  description: 'Toma el control de tu dinero con Flowi. Registra gastos, fija metas de ahorro y visualiza tu salud financiera.',
  keywords: 'finanzas personales, control de gastos, ahorro, presupuesto',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>{children}</body>
    </html>
  )
}
