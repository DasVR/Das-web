"use client";

import { useState } from "react";

import { playlist } from "@/config/playlist";
import { cn } from "@/lib/cn";
import { hasCoarsePointer } from "@/lib/capability";
import { useHaptics } from "@/lib/haptics";

export function PlaylistRail() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [coarsePointer] = useState(() => hasCoarsePointer());
  const { pulse } = useHaptics();

  return (
    <aside className="terminal-card liquid-panel relative overflow-hidden p-4">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#85d9ab]">
            {playlist.title}
          </p>
          <p className="mt-1 text-xs text-[#8ebba2]">{playlist.subtitle}</p>
        </div>
        <div className="vinyl-record hidden sm:block" aria-hidden="true" />
      </div>

      <ul className="space-y-2">
        {playlist.tracks.map((track, trackIndex) => {
          const isActive = trackIndex === activeIndex;

          return (
            <li key={`${track.title}-${track.artist}`}>
              <a
                href={track.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => {
                  if (!coarsePointer) {
                    setActiveIndex(trackIndex);
                  }
                }}
                onClick={() => {
                  setActiveIndex(trackIndex);
                  pulse("selection");
                }}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border px-3 py-3 transition duration-300",
                  isActive
                    ? "border-[#8cffc8]/30 bg-white/10 shadow-[0_0_24px_rgba(109,255,176,0.12)]"
                    : "border-white/7 bg-white/4 hover:border-[#6dffb0]/18 hover:bg-white/8",
                )}
              >
                <div className={cn("vinyl-record size-11 shrink-0", isActive && "animate-spin-slow")} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[#dbffea]">{track.title}</p>
                  <p className="truncate text-xs text-[#8ebba2]">
                    {track.artist} · {track.mood}
                  </p>
                </div>
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[#79d9aa]">
                  {track.duration}
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
