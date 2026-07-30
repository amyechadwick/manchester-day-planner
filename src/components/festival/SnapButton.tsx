import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/state/session";
import { imageSrc } from "@/data/photos";

export function SnapButton({ id, name }: { id: string; name: string }) {
  const { takeSnap, hasSnap, snaps } = useSession();
  const snapped = hasSnap(id);

  if (snapped) {
    return (
      <span
        className="shrink-0 flex flex-col items-center gap-1"
        title={`Snapped at ${name}`}
      >
        <img
          src={imageSrc(snaps[id].imageKey)}
          alt={`Your photo from ${name}`}
          loading="lazy"
          width={1024}
          height={1024}
          className="size-9 object-cover border-2 border-brand-ink"
        />
        <span className="font-display text-[10px] leading-none text-brand-blue">
          SNAPPED
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (takeSnap(id)) {
          toast.success("+10 POINTS", { description: `Photo saved from ${name}` });
        }
      }}
      aria-label={`Take a picture at ${name}`}
      className="shrink-0 flex flex-col items-center gap-1 border-2 border-brand-ink bg-brand-yellow px-2 py-1 hover:bg-brand-red hover:text-brand-cream transition"
    >
      <Camera className="size-5" strokeWidth={2.5} />
      <span className="font-display text-[10px] leading-none">+10</span>
    </button>
  );
}
