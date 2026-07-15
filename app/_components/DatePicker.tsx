"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const MONTHS_DE = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
const WEEKDAYS_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function isoOfLocal(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function parseIso(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export default function DatePicker({
  value,
  onChange,
  min,
  invalid,
}: {
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [viewYear, setViewYear] = useState<number>(() => {
    const base = parseIso(value) ?? parseIso(min ?? "") ?? new Date();
    return base.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState<number>(() => {
    const base = parseIso(value) ?? parseIso(min ?? "") ?? new Date();
    return base.getMonth();
  });

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    function updatePlacement() {
      const trigger = triggerRef.current;
      const popover = popoverRef.current;
      if (!trigger) return;
      const triggerRect = trigger.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const popoverHeight = popover?.offsetHeight ?? 360;
      const gap = 12;
      const fitsBelow = spaceBelow >= popoverHeight + gap;
      const fitsAbove = spaceAbove >= popoverHeight + gap;
      if (!fitsBelow && fitsAbove) setPlacement("top");
      else if (!fitsBelow && !fitsAbove && spaceAbove > spaceBelow) setPlacement("top");
      else setPlacement("bottom");
    }
    updatePlacement();
    window.addEventListener("scroll", updatePlacement, true);
    window.addEventListener("resize", updatePlacement);
    return () => {
      window.removeEventListener("scroll", updatePlacement, true);
      window.removeEventListener("resize", updatePlacement);
    };
  }, [open, viewYear, viewMonth]);

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const firstDayMondayIdx = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < firstDayMondayIdx; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(viewYear, viewMonth, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [viewYear, viewMonth]);

  const minDate = parseIso(min ?? "");

  function displayValue() {
    const d = parseIso(value);
    if (!d) return "";
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  }

  function goPrev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function goNext() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`ll-input ll-datepicker__trigger${invalid ? " ll-input--invalid" : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span style={{ opacity: value ? 1 : 0.55 }}>
          {displayValue() || "Datum wählen"}
        </span>
        <span aria-hidden style={{ marginLeft: "auto", opacity: 0.6, fontFamily: "var(--font-serif), serif" }}>
          ✦
        </span>
      </button>

      {open && (
        <div
          ref={popoverRef}
          className={`ll-datepicker ll-datepicker--${placement}`}
          role="dialog"
          aria-label="Datum auswählen"
        >
          <div className="ll-datepicker__nav">
            <button
              type="button"
              onClick={goPrev}
              className="ll-datepicker__navbtn"
              aria-label="Vorheriger Monat"
            >
              ‹
            </button>
            <span className="ll-datepicker__title">
              {MONTHS_DE[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={goNext}
              className="ll-datepicker__navbtn"
              aria-label="Nächster Monat"
            >
              ›
            </button>
          </div>
          <div className="ll-datepicker__weekdays">
            {WEEKDAYS_DE.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="ll-datepicker__grid">
            {cells.map((cell, i) => {
              if (!cell) return <span key={i} className="ll-datepicker__blank" />;
              const iso = isoOfLocal(cell);
              const disabled = minDate ? cell < minDate : false;
              const selected = iso === value;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={`ll-datepicker__day${selected ? " is-selected" : ""}`}
                >
                  {cell.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
