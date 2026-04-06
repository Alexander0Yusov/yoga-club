"use client";

import { MouseEvent, KeyboardEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Transition } from "react-transition-group";

import { defaultStyle, duration, transitionStyles } from "./variants";
import type { PortalProps, PortalStatus } from "./types";

export const Portal: React.FC<PortalProps> = ({
  onModalClose,
  children,
  showModal,
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
      nodeRef.current?.focus();
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showModal]);

  const handleEsc = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Escape") {
      onModalClose();
    }
  };

  const handleBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onModalClose();
    }
  };

  return (
    <Transition
      nodeRef={nodeRef}
      in={showModal}
      timeout={duration}
      mountOnEnter
      unmountOnExit
    >
      {(state) => {
        const currentState = state as PortalStatus;

        return createPortal(
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[currentState],
            }}
            ref={nodeRef}
            tabIndex={0}
            onKeyDown={handleEsc}
            onClick={handleBackdrop}
            className="fixed bottom-0 left-0 right-0 top-0 z-[200] flex items-center justify-center bg-gray-400/50"
          >
            {children}
          </div>,
          document.getElementById("modal") as HTMLElement
        );
      }}
    </Transition>
  );
};
