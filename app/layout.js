import './globals.css'

export const metadata = {
  title: 'Code Converter',
  description: 'IBSheet7 to IBSheet8 Initialization Code Converter',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}