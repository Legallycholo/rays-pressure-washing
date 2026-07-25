import { cn } from "@/lib/utils";

/** Single place where max page width is decided. */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow" | "prose";
}) {
  const sizes = {
    narrow: "max-w-3xl",
    prose: "max-w-2xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8", sizes[size], className)}>
      {children}
    </div>
  );
}
