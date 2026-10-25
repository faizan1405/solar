import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./motion";
import type { ScrollState } from "./SolarScene";
import residential from "@/assets/residential.jpg";

const SolarScene = lazy(() => import("./SolarScene"));

// [start, end] windows of each story beat over hero progress
const BEATS: [number, number][] = [
  [-1, 0.13],
  [0.15, 0.32],
  [0.36, 0.53],
  [0.57, 0.76],
  [0.8, 2],
];

function beatStyle(p: number, [a, b]: [number, number]) {
  const f = 0.04;
  const o = Math.min(1, (p - a) / f, (b - p) / f);
  const v = Math.max(0, o);
  return { opacity: v, transform: `translateY(${(1 - v) * 24}px)`, pointerEvents: v > 0.5 ? "auto" : "none" } as const;
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const state = useRef<ScrollState>({ target: 0, current: 0 }).current;
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    setMounted(true);
    setMobile(window.innerWidth < 768);
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      state.target = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    // UI overlay follows the smoothed value; stops updating once settled
    let ui = 0;
    let last = -1;
    const loop = () => {
      if (Math.abs(state.current - last) > 0.0005) { last = state.current; setP(state.current); }
      ui = requestAnimationFrame(loop);
    };
    ui = requestAnimationFrame(loop);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); cancelAnimationFrame(ui); };
  }, [state]);

  if (reduced) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-ink text-ink-foreground">
        <img src={residential} alt="Modern home with rooftop solar panels" className="absolute inset-0 h-full w-full object-cover opacity-70" width={1600} height={1008} />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-20">
          <HeroCopy />
        </div>
      </section>
    );
  }

  return (
    <section ref={wrap} className="relative h-[380vh] bg-paper" aria-label="Solar story">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          {mounted && (
            <Suspense fallback={null}>
              <SolarScene state={state} mobile={mobile} />
            </Suspense>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper/60 to-transparent md:via-paper/30" />

        <div className="relative mx-auto h-full max-w-7xl px-6">
          {/* Scene 1 */}
          <div className="absolute inset-x-6 bottom-16 md:bottom-24 md:max-w-2xl" style={beatStyle(p, BEATS[0]!)}>
            <HeroCopy />
          </div>
          {/* Scene 2 */}
          <div className="absolute left-6 top-1/3" style={beatStyle(p, BEATS[1]!)}>
            <Label n="02" title="High-Efficiency Solar Technology" body="Monocrystalline modules, precision-mounted to your roof." />
          </div>
          {/* Scene 3 */}
          <div className="absolute left-6 top-1/4 md:top-1/3" style={beatStyle(p, BEATS[2]!)}>
            <p className="eyebrow text-primary">03 — Capture</p>
            <div className="mt-4 font-display text-4xl font-black leading-[0.95] text-ink md:text-6xl">
              <div>Sunlight</div>
              <div className="text-sun">↓</div>
              <div>Solar panels</div>
              <div className="text-sun">↓</div>
              <div className="text-primary">Clean energy.</div>
            </div>
          </div>
          {/* Scene 4 */}
          <div className="absolute left-6 top-1/3" style={beatStyle(p, BEATS[3]!)}>
            <Label n="04" title="Generate Your Own Electricity" body="Power flows from your roof straight into your home — every sunny hour." volt />
          </div>
          {/* Scene 5 */}
          <div className="absolute inset-x-6 bottom-16 md:bottom-24 md:max-w-2xl" style={beatStyle(p, BEATS[4]!)}>
            <p className="eyebrow text-primary">05 — Independence</p>
            <h2 className="mt-4 font-display text-5xl font-black leading-[0.9] text-ink md:text-7xl">
              Lower Bills.<br />Higher Independence.
            </h2>
            <a href="#calculator" className="mt-8 inline-flex rounded-md bg-ink px-7 py-4 text-sm font-bold text-ink-foreground transition hover:-translate-y-0.5 hover:bg-primary">
              See How Much You Can Save →
            </a>
          </div>
        </div>

        {/* progress rail */}
        <div className="absolute bottom-8 right-6 hidden items-center gap-3 md:flex">
          <span className="eyebrow text-muted-foreground">{String(Math.min(5, Math.floor(p * 5) + 1)).padStart(2, "0")} / 05</span>
          <div className="h-px w-32 bg-border">
            <div className="h-px bg-ink" style={{ width: `${p * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <>
      <p className="eyebrow text-primary">Rooftop solar · India</p>
      <h1 className="mt-5 font-display text-[clamp(3.2rem,9vw,7.5rem)] font-black leading-[0.85] text-ink">
        Power Your<br />Future With<br /><span className="text-primary">Solar.</span>
      </h1>
      <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
        Generate your own clean energy, reduce electricity bills and take control of your energy costs.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#calculator" className="inline-flex min-h-12 items-center rounded-md bg-ink px-7 text-sm font-bold text-ink-foreground transition hover:-translate-y-0.5 hover:bg-primary">
          Calculate Your Savings
        </a>
        <a href="#contact" className="inline-flex min-h-12 items-center rounded-md border border-ink/20 px-7 text-sm font-bold text-ink transition hover:border-ink">
          Get Free Solar Consultation
        </a>
      </div>
      <p className="mt-10 eyebrow text-muted-foreground">Scroll to explore ↓</p>
    </>
  );
}

function Label({ n, title, body, volt }: { n: string; title: string; body: string; volt?: boolean }) {
  return (
    <div className="max-w-sm border-l-2 border-sun bg-card/85 p-6 shadow-lift backdrop-blur-sm">
      <p className="eyebrow text-muted-foreground">{n}</p>
      <p className={`mt-2 font-display text-3xl font-extrabold leading-tight md:text-4xl ${volt ? "text-primary" : "text-ink"}`}>{title}</p>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
