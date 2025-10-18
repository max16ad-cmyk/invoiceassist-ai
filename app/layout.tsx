import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'InvoiceAssist',
  description: 'Automatische Rechnungsverarbeitung für kleine Unternehmen',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          padding: '2rem',
          fontFamily: 'Inter, system-ui, Arial, sans-serif',
          backgroundColor: '#f8fafc',
          color: '#111',
        }}
      >
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#2b7bb9', margin: 0 }}>InvoiceAssist</h1>
          <p style={{ color: '#666', margin: 0 }}>Automatische Rechnungsverarbeitung</p>
        </header>
        {children}
      </body>
    </html>
  );
}
