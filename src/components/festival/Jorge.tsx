import jorgeFull from "@/assets/jorge-full.png.asset.json";
import jorgeHead from "@/assets/jorge-head.png.asset.json";

export const JORGE_FULL_URL = jorgeFull.url;
export const JORGE_HEAD_URL = jorgeHead.url;

const SIZES = {
  badge: "size-8",
  inline: "size-14",
  medium: "size-24",
  hero: "size-40",
} as const;

export function Jorge({
  variant = "head",
  size = "inline",
  className = "",
  decorative = false,
  priority = false,
}: {
  variant?: "head" | "full";
  size?: keyof typeof SIZES;
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}) {
  const src = variant === "full" ? JORGE_FULL_URL : JORGE_HEAD_URL;
  return (
    <img
      src={src}
      alt={decorative ? "" : "Jorge, the Manchester Day mascot"}
      aria-hidden={decorative || undefined}
      loading={priority ? "eager" : "lazy"}
      width={1024}
      height={1024}
      className={`${SIZES[size]} object-contain shrink-0 ${className}`}
    />
  );
}

export function JorgeSays({
  children,
  size = "inline",
  variant = "head",
  tone = "light",
}: {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  variant?: "head" | "full";
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex items-center gap-3">
      <Jorge variant={variant} size={size} />
      <div
        className={`relative flex-1 border-2 border-brand-ink p-3 ${
          tone === "dark"
            ? "bg-brand-ink text-brand-cream"
            : "bg-white text-brand-ink"
        }`}
      >
        <span
          className={`absolute -left-[9px] top-1/2 -translate-y-1/2 size-3 rotate-45 border-l-2 border-b-2 border-brand-ink ${
            tone === "dark" ? "bg-brand-ink" : "bg-white"
          }`}
        />
        <div className="text-sm leading-snug">{children}</div>
      </div>
    </div>
  );
}
