export const runtime = "nodejs"; // Vercel Node runtime
export const dynamic = "force-dynamic";

function parseEuroFromName(name){
  const m = String(name).match(/(\d+[\.,]\d{2}|\d{2,})/);
  if (!m) return null;
  const raw = m[1].replace(/\./g,"").replace(",", ".");
  const f = parseFloat(raw);
  return Number.isFinite(f) ? f : null;
}

function guessSupplier(name){
  const base = String(name).replace(/\.pdf$/i,"").replace(/[_-]+/g," ").trim();
  const word = base.split(" ")[0] || "Unbekannt";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export async function POST(req){
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "Keine Datei erhalten." }), { status: 400 });
    }
    const name = file.name || "Rechnung.pdf";
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,"0");
    const mm = String(today.getMonth()+1).padStart(2,"0");
    const yyyy = today.getFullYear();
    const simulated = {
      filename: name,
      number: "INV-" + Math.random().toString(36).slice(2,8).toUpperCase(),
      date: `${dd}.${mm}.${yyyy}`,
      supplier: guessSupplier(name),
      total: parseEuroFromName(name) ?? null,
      vat_percent: 19
    };
    return new Response(JSON.stringify(simulated), {
      headers: { "content-type": "application/json" }
    });
  } catch (e){
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
