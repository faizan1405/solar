import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  variant = "reveal",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article";
  variant?: "reveal" | "reveal-clip";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <Tag
      ref={ref}
      className={`${variant} ${inView ? "is-in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Masked staggered word reveal */
export function SplitText({ text, className = "", stagger = 60 }: { text: string; className?: string; stagger?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.2);
  return (
    <span ref={ref} className={`${inView ? "is-in" : ""} ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="reveal-mask mr-[0.22em]">
          <span style={{ "--d": `${i * stagger}ms` } as CSSProperties}>{w}</span>
        </span>
      ))}
    </span>
  );
}

export function Counter({ to, duration = 1800, format = (n: number) => Math.round(n).toLocaleString("en-IN") }: { to: number; duration?: number; format?: (n: number) => string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{format(v)}</span>;
}

/** Progress (0-1) of an element through the viewport while it is pinned/scrolled */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / (total > 0 ? total : r.height))));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return { ref, p };
}

export function usePrefersReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const h = () => setR(m.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);
  return r;
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const inrShort = (n: number) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(1)}Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)}L` : inr(n);
