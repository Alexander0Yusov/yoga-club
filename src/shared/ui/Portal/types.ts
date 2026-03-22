export type PortalStatus = "entering" | "entered" | "exiting" | "exited";

export interface PortalProps {
  children: React.ReactNode;
  onModalClose: () => void;
  showModal: boolean;
  className?: string;
}
