import { Heart } from "lucide-react";
import { imageSrc } from "@/data/photos";
import { formatClock } from "@/lib/distance";
import { JORGE_HEAD_URL } from "./Jorge";

export interface FeedItem {
  id: string;
  author: string;
  mine: boolean;
  spotName: string;
  area?: string;
  caption: string;
  imageKey: string;
  takenAt: number;
  likes: number;
}

export function PhotoCard({ item }: { item: FeedItem }) {
  return (
    <article className="border-2 border-brand-ink bg-white">
      <div className="flex items-center gap-2 p-2 border-b-2 border-brand-ink">
        {item.mine ? (
          <img
            src={JORGE_HEAD_URL}
            alt="Jorge, the Manchester Day mascot"
            loading="lazy"
            width={1024}
            height={1024}
            className="size-8 rounded-full border-2 border-brand-ink bg-brand-yellow object-contain"
          />
        ) : (
          <span
            className="size-8 rounded-full border-2 border-brand-ink flex items-center justify-center font-display text-sm"
            style={{ backgroundColor: "#1E4FB8", color: "#FBF3E2" }}
          >
            {item.author.slice(0, 1)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-none">
            {item.mine ? "YOU" : item.author.toUpperCase()}
          </p>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
            {item.spotName}
            {item.area ? ` · ${item.area}` : ""}
          </p>
        </div>
        <span className="font-display text-lg leading-none opacity-70">
          {formatClock(item.takenAt)}
        </span>
      </div>
      <img
        src={imageSrc(item.imageKey)}
        alt={`${item.mine ? "Your" : `${item.author}'s`} photo from ${item.spotName}`}
        loading="lazy"
        width={1024}
        height={1024}
        className="w-full aspect-square object-cover"
      />
      <div className="p-2 border-t-2 border-brand-ink">
        <p className="flex items-center gap-1 font-display text-lg leading-none">
          <Heart
            className="size-4"
            strokeWidth={2.5}
            fill={item.mine ? "#E63329" : "none"}
          />
          {item.likes} LIKES
        </p>
        <p className="text-xs mt-1">{item.caption}</p>
      </div>
    </article>
  );
}
