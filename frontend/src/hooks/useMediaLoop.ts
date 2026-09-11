import { useEffect, useState } from "react";
import type { MediaItem } from "../types/types";

export const useMediaLoop = (
  playlist: MediaItem[],
  syncItem: MediaItem | null,
) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (syncItem || playlist.length === 0) return;

    const currentMedia = playlist[currentIndex];

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    }, currentMedia.duration * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, playlist, syncItem]);

  return syncItem ? syncItem : playlist[currentIndex];
};
