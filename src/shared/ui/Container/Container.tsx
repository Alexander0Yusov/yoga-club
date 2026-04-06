import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={[
        "mx-auto box-border w-full px-page-gutter",
        "sm:max-w-[292px]",
        "md:max-w-[708px]",
        "lg:max-w-[1382px]",
        "xl:px-[29px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
