import { useEffect, useState } from "react";

const links = [
  ["Residential", "#solutions"],
  ["Commercial", "#solutions"],
  ["Industrial", "#solutions"],
  ["Projects", "#projects"],
  ["About", "#why-us"],
  ["Contact", "#contact"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border/60 bg-paper/75 backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-black tracking-tight text-ink">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-sun">
            <span className="h-2.5 w-2.5 rounded-full bg-ink" />
          </span>
          SURYAVAN
        </a>
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map(([l, h]) => (
            <li key={l}><a href={h} className="text-sm font-semibold text-ink/70 transition hover:text-ink">{l}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#calculator" className="hidden min-h-11 items-center rounded-md bg-ink px-5 text-sm font-bold text-ink-foreground transition hover:bg-primary sm:inline-flex">Get Solar Quote</a>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center lg:hidden">
            <span className="block h-0.5 w-6 bg-ink shadow-[0_6px_0_var(--ink)]" />
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border bg-paper px-6 py-4 lg:hidden">
          {links.map(([l, h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} className="block py-3 font-display text-2xl font-bold text-ink">{l}</a>
          ))}
          <a href="#calculator" onClick={() => setOpen(false)} className="mt-3 flex min-h-12 items-center justify-center rounded-md bg-ink font-bold text-ink-foreground">Get Solar Quote</a>
        </div>
      )}
    </header>
  );
}
