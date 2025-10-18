import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'InvoiceAssist – Automatische Rechnungsverarbeitung',
  description: 'InvoiceAssist automatisiert die Erfassung und Analyse von Rechnungsdaten.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body
        style={{
          fontFamily: 'Inter, system-ui, Arial, sans-serif',
          backgroundColor: '#f5f9fc',
          margin: 0,
          padding: 24,
        }}
      >
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ color: '#2b7bb9' }}>InvoiceAssist</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
