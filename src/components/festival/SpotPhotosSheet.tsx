import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { imageSrc, seedPhotosForPoi } from "@/data/photos";
import { formatClock } from "@/lib/distance";

export function SpotPhotosSheet({ id, name }: { id: string; name: string }) {
  const photos = seedPhotosForPoi(id);

  return (
    <Dialog>
      <DialogTrigger
        aria-label={`See other people's pictures from ${name}`}
        className="shrink-0 flex flex-col items-center gap-1 border-2 border-brand-ink bg-white px-2 py-1 hover:bg-brand-blue hover:text-brand-cream transition"
      >
        <Users className="size-5" strokeWidth={2.5} />
        <span className="font-display text-[10px] leading-none">
          {photos.length}
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-[92vw] sm:max-w-sm bg-brand-cream border-2 border-brand-ink text-brand-ink max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl leading-none text-left">
            FROM THIS SPOT
          </DialogTitle>
        </DialogHeader>
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 -mt-2">
          {name} · one picture per person
        </p>
        <ul className="space-y-3">
          {photos.map((p) => (
            <li key={p.id} className="border-2 border-brand-ink bg-white">
              <img
                src={imageSrc(p.imageKey)}
                alt={`${p.author}'s photo from ${name}`}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full aspect-square object-cover border-b-2 border-brand-ink"
              />
              <div className="p-2">
                <p className="font-display text-xl leading-none">
                  {p.author.toUpperCase()}
                </p>
                <p className="text-[11px] opacity-70">{p.caption}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-60">
                  {formatClock(p.takenAt)} · {p.likes} likes
                </p>
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
