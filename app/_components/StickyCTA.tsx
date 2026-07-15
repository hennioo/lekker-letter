"use client";

import { useEffect, useState } from "react";

export default function StickyCTA({
  href = "/new",
  label = "Verschenken →",
  threshold = 700,
  bottomOffset = 180,
}: {
  href?: string;
  label?: string;
  threshold?: number;
  bottomOffset?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function check() {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const nearBottom = window.innerHeight + scrolled >= docHeight - bottomOffset;
      setVisible(scrolled > threshold && !nearBottom);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [threshold, bottomOffset]);

  return (
    <a
      href={href}
      className={`ll-sticky-cta${visible ? " is-visible" : ""}`}
      aria-hidden={!visible}
    >
      {label}
    </a>
  );
}
