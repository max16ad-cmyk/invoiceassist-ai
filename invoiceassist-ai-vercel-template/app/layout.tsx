import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "InvoiceAssist – Automatische Rechnungsverarbeitung",
  description: "PDF hochladen → KI-Extraktion → Dashboard. DSGVO-freundliches MVP."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="max-w-6xl mx-auto px-4">
          <header className="flex items-center justify-between py-5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-brand-500 rotate-45 rounded-sm" />
              <span className="font-bold">InvoiceAssist</span>
            </div>
            <nav className="text-sm opacity-80 space-x-4">
              <a href="#features">Vorteile</a>
              <a href="#dashboard">Dashboard</a>
              <a href="#upload">Upload</a>
            </nav>
          </header>
          {children}
          <footer className="flex items-center justify-between py-10 text-sm opacity-75">
            <small>© {new Date().getFullYear()} Dateno AI — InvoiceAssist Demo</small>
            <div>Datenschutz · Impressum</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
