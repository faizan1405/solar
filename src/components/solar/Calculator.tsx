import { useEffect, useMemo, useRef, useState } from "react";
import { inr, inrShort, Reveal, SplitText } from "./motion";

type PType = "Home" | "Commercial" | "Industrial";
const COST_PER_KW: Record<PType, number> = { Home: 50000, Commercial: 45000, Industrial: 40000 };

// Approximate model: ~₹1,300 of monthly bill per kW; ~78% of bill offset.
export function estimate(bill: number, type: PType, roof?: number) {
  let kw = Math.max(1, Math.round(bill / 1300));
  if (roof && roof > 0) kw = Math.max(1, Math.min(kw, Math.floor(roof / 100)));
  const annualCost = bill * 12;
  const cost = kw * COST_PER_KW[type];
  const annualSavings = Math.min(annualCost, kw * 1300 * 12 * 0.78);
  const payback = cost / annualSavings;
  const lifetime = annualSavings * 25 * 0.8;
  return { kw, annualCost, cost, annualSavings, payback, lifetime };
}

function useTween(value: number, ms = 700) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const n = a + (value - a) * (1 - Math.pow(1 - p, 3));
      setV(n);
      from.current = n;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return v;
}

export function Calculator() {
  const [bill, setBill] = useState(8000);
  const [type, setType] = useState<PType>("Home");
  const [roof, setRoof] = useState("");
  const [city, setCity] = useState("");
  const r = useMemo(() => estimate(bill, type, Number(roof) || undefined), [bill, type, roof]);
  const savings = useTween(r.annualSavings);
  const payback = useTween(r.payback);
  const life = useTween(r.lifetime);
  const kw = useTween(r.kw);
  const cost = useTween(r.cost);

  return (
    <section id="calculator" className="relative bg-ink py-24 text-ink-foreground md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow text-sun">Savings calculator</p>
        <h2 className="mt-4 max-w-4xl font-display text-5xl font-black leading-[0.9] md:text-8xl">
          <SplitText text="Calculate Your Solar Savings." />
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Reveal className="space-y-10">
            <div>
              <label htmlFor="bill" className="eyebrow text-ink-foreground/60">Monthly electricity bill</label>
              <div className="mt-3 flex items-baseline gap-2 border-b border-ink-foreground/20 pb-3">
                <span className="font-display text-4xl font-bold text-sun">₹</span>
                <input
                  id="bill"
                  inputMode="numeric"
                  value={bill.toLocaleString("en-IN")}
                  onChange={(e) => setBill(Math.min(5000000, Number(e.target.value.replace(/\D/g, "")) || 0))}
                  className="w-full bg-transparent font-display text-5xl font-black outline-none"
                />
              </div>
              <input type="range" min={1000} max={type === "Home" ? 50000 : 500000} step={500} value={bill} onChange={(e) => setBill(Number(e.target.value))} className="mt-5 w-full accent-[var(--sun)]" aria-label="Bill slider" />
            </div>
            <div>
              <p className="eyebrow text-ink-foreground/60">Property type</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["Home", "Commercial", "Industrial"] as PType[]).map((t) => (
                  <button key={t} onClick={() => setType(t)} className={`min-h-12 rounded-md border text-sm font-bold transition ${type === t ? "border-sun bg-sun text-ink" : "border-ink-foreground/20 hover:border-ink-foreground/60"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="eyebrow text-ink-foreground/60">Roof area (sq ft)</span>
                <input value={roof} onChange={(e) => setRoof(e.target.value.replace(/\D/g, ""))} placeholder="Optional" inputMode="numeric" className="mt-3 min-h-12 w-full rounded-md border border-ink-foreground/20 bg-transparent px-4 outline-none focus:border-sun" />
              </label>
              <label className="block">
                <span className="eyebrow text-ink-foreground/60">City</span>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Optional" className="mt-3 min-h-12 w-full rounded-md border border-ink-foreground/20 bg-transparent px-4 outline-none focus:border-sun" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-6 border-t border-ink-foreground/15 pt-6 text-sm">
              <div><p className="text-ink-foreground/50">Current annual cost</p><p className="mt-1 font-display text-2xl font-bold">{inr(r.annualCost)}</p></div>
              <div><p className="text-ink-foreground/50">Recommended system</p><p className="mt-1 font-display text-2xl font-bold">{Math.round(kw)} kW</p></div>
              <div className="col-span-2"><p className="text-ink-foreground/50">Approx. investment</p><p className="mt-1 font-display text-2xl font-bold">{inr(cost)}</p></div>
            </div>
          </Reveal>

          <Reveal delay={150} className="flex flex-col">
            <div className="grid flex-1 gap-px overflow-hidden rounded-md bg-ink-foreground/15 sm:grid-cols-2">
              <div className="bg-ink p-8 sm:col-span-2 md:p-12">
                <p className="font-display text-[clamp(3.5rem,9vw,8rem)] font-black leading-none text-sun">{inr(savings)}</p>
                <p className="eyebrow mt-4 text-ink-foreground/60">Annual savings</p>
              </div>
              <div className="bg-ink p-8 md:p-10">
                <p className="font-display text-6xl font-black leading-none">{payback.toFixed(1)}<span className="text-2xl"> yrs</span></p>
                <p className="eyebrow mt-4 text-ink-foreground/60">Estimated payback</p>
              </div>
              <div className="bg-ink p-8 md:p-10">
                <p className="font-display text-6xl font-black leading-none text-volt">{inrShort(life)}+</p>
                <p className="eyebrow mt-4 text-ink-foreground/60">25-year savings</p>
              </div>
            </div>
            <a href="#contact" className="mt-6 flex min-h-14 items-center justify-center rounded-md bg-sun font-bold text-ink transition hover:-translate-y-0.5">
              Get My Exact Solar Quote{city ? ` for ${city}` : ""} →
            </a>
            <p className="mt-4 text-xs leading-relaxed text-ink-foreground/50">
              These numbers are approximate estimates. Actual savings depend on your electricity tariff, system size, sunlight, location and installation conditions.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
