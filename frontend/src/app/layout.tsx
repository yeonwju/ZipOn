import './globals.css'

import React from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={'h-full'}>
      <body suppressHydrationWarning className={'h-full'}>
        {children}
      </body>
    </html>
  )
}
