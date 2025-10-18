'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, RefreshCw, CheckCircle2, Wand2, ShieldCheck, Download } from "lucide-react";
import clsx from "clsx";

type Invoice = {
  id: string;
  filename: string;
  number: string;
  date?: string | null;
  supplier: string;
  total?: number | null;
  vat_percent?: number | null;
  status: "Neu" | "Bestätigt";
  created_at: string;
};

function useLocalInvoices(){
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("invoices");
      if (raw) setInvoices(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("invoices", JSON.stringify(invoices)); } catch {}
  }, [invoices]);
  return { invoices, setInvoices };
}

export default function Home() {
  const { invoices, setInvoices } = useLocalInvoices();
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<string>("");

  async function handleUpload(file: File){
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const inv: Invoice = {
        id: crypto.randomUUID(),
        filename: file.name,
        number: data.number ?? "N/A",
        date: data.date ?? null,
        supplier: data.supplier ?? "Unbekannt",
        total: data.total ?? null,
        vat_percent: data.vat_percent ?? null,
        status: "Neu",
        created_at: new Date().toISOString()
      };
      setInvoices([inv, ...invoices]);
    } catch (e:any) {
      alert("Fehler beim Upload: " + (e?.message || e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function confirmInvoice(id: string){
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: "Bestätigt" } : i));
  }

  function exportCSV(){
    const head = ["ID","Nummer","Datum","Lieferant","Betrag","MwSt %","Status","Erstellt"];
    const rows = invoices.map(i => [
      i.id, i.number, i.date ?? "", i.supplier ?? "",
      (i.total ?? "").toString().replace(".", ","),
      i.vat_percent ?? "", i.status, i.created_at
    ]);
    const csv = [head, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    if (!filter) return invoices;
    return invoices.filter(i => i.status === filter);
  }, [filter, invoices]);

  return (
    <main>
      <section className="card p-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Automatische Rechnungsverarbeitung für kleine Unternehmen</h1>
        <p className="opacity-80 mb-5">PDF hochladen → KI-Extraktion → Dashboard. DSGVO-freundlich, EU-Hosting möglich.</p>
        <div className="flex items-center justify-center gap-3">
          <label className={clsx("btn cursor-pointer", busy && "pointer-events-none opacity-60")}>
            <Upload className="w-4 h-4" />
            <input id="upload" ref={fileRef} hidden type="file" accept="application/pdf" onChange={(e)=>{
              const f = e.target.files?.[0]; if (f) handleUpload(f);
            }} />
            <span>Rechnung hochladen (PDF)</span>
          </label>
          <button className="btn" onClick={()=>window.scrollTo({top: document.getElementById('dashboard')?.offsetTop ?? 0, behavior:'smooth'})}>
            <RefreshCw className="w-4 h-4"/> Zum Dashboard
          </button>
        </div>
        {busy && <div className="mt-3 text-sm">Lade hoch & verarbeite …</div>}
      </section>

      <section id="dashboard" className="card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Rechnungen</h2>
          <div className="flex items-center gap-2">
            <select className="select" value={filter} onChange={(e)=>setFilter(e.target.value)}>
              <option value="">Status: Alle</option>
              <option value="Neu">Neu</option>
              <option value="Bestätigt">Bestätigt</option>
            </select>
            <button className="btn" onClick={exportCSV}><Download className="w-4 h-4"/> CSV Export</button>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Nummer</th>
                <th className="py-2 pr-3">Datum</th>
                <th className="py-2 pr-3">Lieferant</th>
                <th className="py-2 pr-3">Betrag (€)</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-5 text-center opacity-70">Noch keine Einträge.</td></tr>
              )}
              {filtered.map(i => (
                <tr key={i.id} className="border-b hover:bg-slate-50/60">
                  <td className="py-2 pr-3">{i.id.slice(0,8)}</td>
                  <td className="py-2 pr-3">{i.number}</td>
                  <td className="py-2 pr-3">{i.date ?? ""}</td>
                  <td className="py-2 pr-3">{i.supplier}</td>
                  <td className="py-2 pr-3">{i.total != null ? i.total.toFixed(2) : ""}</td>
                  <td className="py-2 pr-3">
                    <span className={clsx("badge", i.status==="Bestätigt" ? "badge-ok" : "badge-neu")}>
                      {i.status}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    {i.status==="Neu" && (
                      <button className="btn" onClick={()=>confirmInvoice(i.id)}>
                        <CheckCircle2 className="w-4 h-4"/> Übernehmen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="features" className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card p-5">
          <Wand2 className="w-5 h-5"/>
          <h3 className="font-semibold mt-2">Automatische Extraktion</h3>
          <p className="text-sm opacity-80">Nummer, Datum, Betrag & Lieferant werden automatisch erkannt (Demo-Engine).</p>
        </div>
        <div className="card p-5">
          <ShieldCheck className="w-5 h-5"/>
          <h3 className="font-semibold mt-2">DSGVO-freundlich</h3>
          <p className="text-sm opacity-80">Serverloses Demo-Setup – keine Dokumente werden dauerhaft gespeichert.</p>
        </div>
        <div className="card p-5">
          <CheckCircle2 className="w-5 h-5"/>
          <h3 className="font-semibold mt-2">Export</h3>
          <p className="text-sm opacity-80">CSV-Export für den schnellen Test mit echten Daten.</p>
        </div>
      </section>
    </main>
  );
}
