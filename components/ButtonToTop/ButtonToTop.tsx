"use client";

import React, { useState, useEffect, useRef } from "react";

const buttonLocations = {
  top: {
    display: "none",
  },
  middle: {
    position: "fixed",
    right: "20px",
  },
  bottom: {
    position: "absolute",
    right: "20px",
  },
};

const ButtonToTop = () => {
  const footerHeight = useRef(null);

  const [buttonLocation, setButtonLocation] = useState(buttonLocations.top);
  const [buttomPosition, setButtomPosition] = useState(0);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;

    const restDistanceUnderViewport =
      documentHeight - (scrollTop + windowHeight);

    const distanceToFooter =
      restDistanceUnderViewport - Number(footerHeight.current);

    if (scrollTop < 200) {
      setButtonLocation(buttonLocations.top as any);
    }
    if (scrollTop > 200 && distanceToFooter > 50) {
      setButtonLocation(buttonLocations.middle as any);
      setButtomPosition(20);
    }
    if (scrollTop > 200 && distanceToFooter < 0) {
      setButtonLocation(buttonLocations.bottom as any);
      setButtomPosition(Number(footerHeight.current) + 20);
    }
  };

  const handleFooterResize = () => {
    const footerEl = document.getElementById("footer");
    if (footerEl) {
      footerHeight.current = footerEl.getBoundingClientRect().height as any;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleFooterResize);

    handleFooterResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleFooterResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      style={
        {
          ...buttonLocation,
          bottom: `${buttomPosition}px`,
        } as React.CSSProperties
      }
      className="border-[1px] border-orange-600 p-1 rounded-full"
    >
      Вгору
    </button>
  );
};

export default ButtonToTop;
