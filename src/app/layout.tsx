import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Murat Sağ - Portfolio',
  description: 'Software Developer & Computer Engineering Student',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 