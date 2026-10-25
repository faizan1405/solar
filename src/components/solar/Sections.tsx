import { useState } from "react";
import { Counter, Reveal, SplitText, useInView, useSectionProgress } from "./motion";
import residential from "@/assets/residential.jpg";
import commercial from "@/assets/commercial.jpg";
import industrial from "@/assets/industrial.jpg";
import aerial from "@/assets/aerial.jpg";

/* ---------------- Why solar ---------------- */
const benefits = [
  ["01", "Reduce Electricity Bills", "Offset a large share of your monthly grid consumption with power from your own roof."],
  ["02", "Generate Your Own Power", "Every panel turns idle roof space into a small, silent power plant."],
  ["03", "Protection From Rising Costs", "Lock in a predictable energy cost while utility tariffs keep moving."],
  ["04", "Clean Renewable Energy", "Cut your carbon footprint for 25+ years with zero fuel and zero noise."],
];

export function WhySolar() {
  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-primary">Why solar</p>
          <h2 className="mt-4 font-display text-6xl font-black leading-[0.88] text-ink md:text-8xl">
            <SplitText text="Your Roof Can Do More." />
          </h2>
          <Reveal variant="reveal-clip" className="mt-10 overflow-hidden rounded-md">
            <img src={residential} alt="Rooftop solar on a modern villa" loading="lazy" width={1600} height={1008} className="aspect-[4/3] w-full object-cover" />
          </Reveal>
        </div>
        <div className="space-y-4 lg:pt-40">
          {benefits.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 80}>
              <article className="group relative overflow-hidden border-t border-ink/15 py-10 transition-all duration-500 hover:pl-6">
                <span className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-sun transition-transform duration-500 group-hover:scale-y-100" />
                <p className="eyebrow text-muted-foreground">{n}</p>
                <h3 className="mt-3 font-display text-3xl font-extrabold text-ink md:text-4xl">{t}</h3>
                <p className="mt-3 max-w-md text-muted-foreground">{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Energy flow ---------------- */
const flow = [
  ["Sunlight", "Photons from the sun reach your rooftop every day.", "☀"],
  ["Solar panels", "Panels capture sunlight and convert it into DC electricity.", "▦"],
  ["Inverter", "The inverter converts DC electricity into usable AC electricity.", "⇄"],
  ["Home", "Your home uses clean solar electricity first.", "⌂"],
  ["Grid / Battery", "Excess electricity can flow to the grid depending on your installed system and applicable net-metering arrangements.", "⚡"],
];

export function EnergyFlow() {
  const { ref, p } = useSectionProgress<HTMLDivElement>();
  const active = Math.min(flow.length - 1, Math.floor(p * flow.length));
  return (
    <section ref={ref} className="relative h-[260vh] bg-secondary">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6">
          <p className="eyebrow text-primary">How it works</p>
          <h2 className="mt-4 font-display text-5xl font-black leading-[0.9] text-ink md:text-7xl">From sunlight to switch.</h2>
          <div className="relative mt-14 grid grid-cols-5 gap-2 md:gap-6">
            <svg className="pointer-events-none absolute left-[10%] right-[10%] top-8 h-4 w-[80%] md:top-12" viewBox="0 0 100 4" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="100" y2="2" stroke="var(--border)" strokeWidth="0.6" />
              <line x1="0" y1="2" x2={p * 100} y2="2" stroke="var(--primary)" strokeWidth="0.8" />
              <line x1="0" y1="2" x2={p * 100} y2="2" stroke="var(--sun)" strokeWidth="1.4" className="energy-dash" vectorEffect="non-scaling-stroke" />
            </svg>
            {flow.map(([t, , icon], i) => (
              <div key={t} className="relative flex flex-col items-center text-center">
                <div className={`grid h-16 w-16 place-items-center rounded-full border-2 text-2xl transition-all duration-500 md:h-24 md:w-24 md:text-4xl ${i <= active ? "border-primary bg-ink text-sun scale-105" : "border-border bg-card text-muted-foreground"}`}>
                  {icon}
                </div>
                <p className={`mt-4 font-display text-xs font-bold md:text-lg ${i === active ? "text-ink" : "text-muted-foreground"}`}>{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 min-h-32 max-w-2xl">
            <p className="eyebrow text-muted-foreground">Step {active + 1} / {flow.length}</p>
            <p key={active} className="mt-3 animate-fade-in font-display text-2xl font-bold leading-snug text-ink md:text-4xl">{flow[active]?.[1]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Before / after ---------------- */
export function Comparison() {
  const [x, setX] = useState(50);
  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow text-primary">Before vs after</p>
        <h2 className="mt-4 font-display text-5xl font-black leading-[0.9] text-ink md:text-7xl"><SplitText text="Drag to see the difference." /></h2>
        <Reveal className="relative mt-14 h-[520px] select-none overflow-hidden rounded-md md:h-[460px]">
          <Side kind="without" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${x}%)` }}><Side kind="with" /></div>
          <div className="pointer-events-none absolute inset-y-0 w-px bg-sun" style={{ left: `${x}%` }}>
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun px-4 py-3 text-sm font-black text-ink shadow-lift">⇆</div>
          </div>
          <input type="range" min={0} max={100} value={x} onChange={(e) => setX(Number(e.target.value))} aria-label="Compare without and with solar" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
        </Reveal>
      </div>
    </section>
  );
}

function Side({ kind }: { kind: "without" | "with" }) {
  const w = kind === "with";
  const rows = w
    ? [["Potential electricity savings", "Significant"], ["Own clean electricity", "Yes"], ["Long-term energy cost", "Reduced"]]
    : [["Monthly bill", "₹8,000"], ["Annual electricity expense", "₹96,000"], ["Dependence on utility", "High"]];
  return (
    <div className={`absolute inset-0 flex ${w ? "justify-end bg-primary text-primary-foreground" : "bg-card text-ink"}`}>
      <div className={`flex w-1/2 flex-col justify-center p-6 md:p-14 ${w ? "items-end text-right" : ""}`}>
        <p className={`eyebrow ${w ? "text-sun" : "text-muted-foreground"}`}>{w ? "With solar" : "Without solar"}</p>
        <div className="mt-8 space-y-6">
          {rows.map(([k, v]) => (
            <div key={k}>
              <p className={`text-xs md:text-sm ${w ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{k}</p>
              <p className="font-display text-2xl font-black md:text-5xl">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Solutions ---------------- */
const solutions = [
  ["Residential Solar", "Reduce household electricity costs and generate clean power directly from your rooftop.", residential, "Explore Residential Solar"],
  ["Commercial Solar", "Turn unused roof space into an energy-generating business asset.", commercial, "Explore Commercial Solar"],
  ["Industrial Solar", "Large-scale solar solutions designed to reduce operating energy costs.", industrial, "Explore Industrial Solar"],
] as const;

export function Solutions() {
  return (
    <section id="solutions" className="bg-paper pb-24 md:pb-36">
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow text-primary">Solutions</p>
        <h2 className="mt-4 max-w-4xl font-display text-5xl font-black leading-[0.9] text-ink md:text-8xl"><SplitText text="Solar Solutions Built Around You" /></h2>
        <div className="mt-20 space-y-24 md:space-y-36">
          {solutions.map(([t, d, img, cta], i) => (
            <div key={t} className={`grid items-center gap-10 md:grid-cols-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <Reveal variant="reveal-clip" className="group overflow-hidden rounded-md md:col-span-7">
                <img src={img} alt={t} loading="lazy" width={1600} height={1008} className="aspect-[16/11] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
              </Reveal>
              <Reveal delay={120} className="md:col-span-5">
                <p className="eyebrow text-muted-foreground">0{i + 1}</p>
                <h3 className="mt-3 font-display text-4xl font-black text-ink md:text-6xl">{t}</h3>
                <p className="mt-5 max-w-md text-lg text-muted-foreground">{d}</p>
                <a href="#contact" className="group/l mt-8 inline-flex items-center gap-3 border-b-2 border-ink pb-1 font-bold text-ink">
                  {cta}<span className="transition-transform group-hover/l:translate-x-1">→</span>
                </a>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stats (placeholders: replace with verified figures) ---------------- */
export const STATS = [
  { value: 500, suffix: "+", label: "Installations" },
  { value: 10, suffix: " MW+", label: "Solar Capacity Installed" },
  { value: 25, prefix: "₹", suffix: " Cr+", label: "Customer Savings" },
  { value: 25, suffix: " Yrs", label: "Panel Performance Life" },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-card py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-14 px-6 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 100} className="border-l border-border pl-6">
            <p className="font-display text-5xl font-black text-ink md:text-7xl">{s.prefix}<Counter to={s.value} />{s.suffix}</p>
            <p className="mt-3 text-sm font-semibold text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-7xl px-6 text-xs text-muted-foreground">Figures shown are placeholders until verified company data is supplied.</p>
    </section>
  );
}

/* ---------------- Projects (horizontal scroll) ---------------- */
const projects = [
  ["Gurugram", "Residential Solar", "8 kW", residential],
  ["Delhi NCR", "Commercial Solar", "25 kW", commercial],
  ["Noida", "Industrial Solar", "100 kW", industrial],
  ["Faridabad", "Utility Scale", "1.2 MW", aerial],
] as const;

export function Projects() {
  const { ref, p } = useSectionProgress<HTMLDivElement>();
  return (
    <section id="projects" className="bg-ink text-ink-foreground">
      {/* desktop pinned horizontal */}
      <div ref={ref} className="relative hidden h-[300vh] md:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-6">
            <p className="eyebrow text-sun">Projects</p>
            <h2 className="mt-4 font-display text-7xl font-black leading-[0.9]">Built For The Real World.</h2>
          </div>
          <div className="mt-12 flex gap-8 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] will-change-transform" style={{ transform: `translate3d(${-p * 62}%,0,0)` }}>
            {projects.map((pr) => <ProjectCard key={pr[0]} pr={pr} />)}
          </div>
        </div>
      </div>
      {/* mobile swipe */}
      <div className="py-24 md:hidden">
        <div className="px-6">
          <p className="eyebrow text-sun">Projects</p>
          <h2 className="mt-4 font-display text-5xl font-black leading-[0.9]">Built For The Real World.</h2>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
          {projects.map((pr) => <ProjectCard key={pr[0]} pr={pr} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ pr: [loc, type, kw, img] }: { pr: (typeof projects)[number] }) {
  return (
    <article className="group relative w-[82vw] shrink-0 snap-center overflow-hidden rounded-md md:w-[46vw]">
      <img src={img} alt={`${type} in ${loc}`} loading="lazy" width={1600} height={1008} className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
        <div>
          <p className="eyebrow text-sun">{type}</p>
          <p className="mt-2 font-display text-3xl font-black md:text-5xl">{loc}</p>
        </div>
        <p className="font-display text-2xl font-black text-volt md:translate-y-4 md:opacity-0 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:text-4xl">{kw}</p>
      </div>
    </article>
  );
}

/* ---------------- Why choose us ---------------- */
const reasons = [
  ["Expert Solar Consultation", "Engineers, not salespeople, walk you through what makes sense for your roof."],
  ["Designed Around Your Usage", "Systems sized from your actual consumption data, not guesswork."],
  ["Quality Solar Components", "Tier-1 modules and proven inverters with clear specifications."],
  ["Professional Installation", "Trained crews, structural checks and clean cable management."],
  ["Monitoring & Support", "Track generation from your phone, with service when you need it."],
  ["Warranty Assistance", "We handle the paperwork and claims process with manufacturers."],
];

export function WhyUs() {
  return (
    <section id="why-us" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow text-primary">Why choose us</p>
        <h2 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.9] text-ink md:text-7xl"><SplitText text="Value you can actually measure." /></h2>
        <div className="mt-16 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(([t, d], i) => (
            <Reveal key={t} delay={i * 70} className="group border-b border-r border-border p-8 transition-colors duration-500 hover:bg-ink md:p-10">
              <p className="font-display text-sm font-bold text-sun">0{i + 1}</p>
              <h3 className="mt-6 font-display text-2xl font-extrabold text-ink transition-colors group-hover:text-ink-foreground">{t}</h3>
              <p className="mt-3 text-muted-foreground transition-colors group-hover:text-ink-foreground/70">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Timeline ---------------- */
const steps = ["Energy Assessment", "Site Survey", "Solar System Design", "Proposal & Savings Estimate", "Installation", "Activation & Monitoring"];

export function Timeline() {
  const { ref, p } = useSectionProgress<HTMLDivElement>();
  return (
    <section className="bg-card py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-primary">Process</p>
          <h2 className="mt-4 font-display text-5xl font-black leading-[0.9] text-ink md:text-7xl">Six steps to your own power.</h2>
        </div>
        <div ref={ref} className="relative">
          <div className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-border" />
          <div className="absolute left-[1.15rem] top-0 w-px bg-primary" style={{ height: `${Math.min(100, p * 115)}%` }} />
          <ol className="space-y-16 md:space-y-24">
            {steps.map((s, i) => {
              const on = p * 115 >= (i / (steps.length - 1)) * 100 - 2;
              return (
                <li key={s} className="relative pl-16">
                  <span className={`absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border-2 font-display text-sm font-black transition-all duration-500 ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={`font-display text-3xl font-extrabold transition-colors md:text-4xl ${on ? "text-ink" : "text-muted-foreground/50"}`}>{s}</h3>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const faqs = [
  ["How much does a solar system cost?", "Cost depends on system size, components and roof structure. Use our calculator for a ballpark, then request a site survey for an exact quote."],
  ["How much can solar reduce my electricity bill?", "Many homes offset a large portion of their bill. The exact figure depends on your consumption, tariff, roof orientation and system size."],
  ["How many solar panels does my home need?", "It depends on your monthly units and available roof area. We size the system from your actual bills during the energy assessment."],
  ["How long does installation take?", "Most residential installations are completed within a few days once approvals and materials are in place."],
  ["What is the lifespan of solar panels?", "Quality panels are typically designed for 25+ years of performance, with gradual output degradation over time."],
  ["Does solar work during cloudy weather?", "Yes, panels still generate electricity on cloudy days, though output is lower than in direct sunlight."],
  ["What happens at night?", "Panels don't generate at night. Your home draws from the grid, or from a battery if your system includes one."],
  ["Is net metering available?", "Net metering availability and rules vary by state and DISCOM. We'll check what applies to your location."],
  ["Are government solar subsidies available?", "Subsidy schemes exist for some categories, but eligibility and amounts change. We'll verify current policy for your location before quoting."],
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="font-display text-5xl font-black leading-[0.9] text-ink md:text-7xl">Questions, answered.</h2>
        <div className="border-t border-ink/15">
          {faqs.map(([q, a], i) => (
            <div key={q} className="border-b border-ink/15">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-bold text-ink md:text-xl" aria-expanded={open === i}>
                {q}
                <span className={`text-2xl transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className="grid transition-all duration-500" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                <p className="overflow-hidden pr-10 text-muted-foreground"><span className="block pb-6">{a}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA + footer ---------------- */
export const WHATSAPP = "https://wa.me/910000000000?text=Hi%2C%20I%27d%20like%20a%20solar%20quote";

export function FinalCTA() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <section id="contact" className="relative overflow-hidden bg-ink text-ink-foreground">
      <img src={aerial} alt="Aerial view of solar panels at sunset" loading="lazy" width={1920} height={1088} className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[2.5s] ${inView ? "scale-100" : "scale-110"}`} />
      <div className="absolute inset-0 bg-ink/55" />
      <div ref={ref} className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 py-24">
        <h2 className="max-w-5xl font-display text-[clamp(3rem,8vw,7.5rem)] font-black leading-[0.88]">
          <SplitText text="Your Electricity Bill Won’t Reduce Itself." />
        </h2>
        <Reveal delay={300}>
          <p className="mt-8 max-w-md text-lg text-ink-foreground/80">Find out how much solar could save you.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#calculator" className="inline-flex min-h-14 items-center rounded-md bg-sun px-8 font-bold text-ink transition hover:-translate-y-0.5">Calculate My Solar Savings</a>
            <a href="tel:+910000000000" className="inline-flex min-h-14 items-center rounded-md border border-ink-foreground/40 px-8 font-bold transition hover:border-ink-foreground">Talk To A Solar Expert</a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center rounded-md bg-volt px-8 font-bold text-ink transition hover:-translate-y-0.5">WhatsApp Us</a>
          </div>
        </Reveal>
      </div>
      <footer className="relative border-t border-ink-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-ink-foreground/60">
          <span className="font-display font-black text-ink-foreground">SURYAVAN</span>
          <span>© {new Date().getFullYear()} Suryavan Solar. All estimates are indicative.</span>
        </div>
      </footer>
    </section>
  );
}

export function WhatsAppFab() {
  return (
    <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-volt text-ink shadow-lift transition hover:scale-110">
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" /></svg>
    </a>
  );
}
