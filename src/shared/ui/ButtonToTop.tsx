"use client";

import { useEffect, useRef, useState } from "react";

import Arrow from "./Arrow";

export default function ButtonToTop() {
  const footerHeight = useRef(0);
  const [visible, setVisible] = useState(false);
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24);

  const handleFooterResize = () => {
    const footerEl = document.getElementById("footer");

    if (footerEl) {
      footerHeight.current = footerEl.getBoundingClientRect().height;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const restDistanceUnderViewport = documentHeight - (scrollTop + windowHeight);
      const distanceToFooter = restDistanceUnderViewport - footerHeight.current;

      setVisible(scrollTop > 80);
      setIsAbsolute(scrollTop > 80 && distanceToFooter <= 48);
      setBottomOffset(distanceToFooter <= 48 ? footerHeight.current + 24 : 24);
    };

    handleFooterResize();
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleFooterResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleFooterResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="До початку сторінки"
      style={{
        bottom: `${bottomOffset}px`,
      }}
      className={`z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#81453e] bg-[#dfd9dc] text-[#81453e] shadow-sm transition hover:bg-[#f5ebe4] ${
        isAbsolute ? "absolute right-6" : "fixed right-6"
      }`}
    >
      <Arrow className="-rotate-90" />
    </button>
  );
}
