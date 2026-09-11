import { useMediaLoop } from "../hooks/useMediaLoop";
import type { MediaItem, WindowConfig } from "../types/types";

interface WindowProps {
  windowConfig: WindowConfig;
  syncItem: MediaItem | null;
}

export const MediaWindow = ({ windowConfig, syncItem }: WindowProps) => {
  const currentMedia = useMediaLoop(windowConfig.playlist, syncItem);

  return (
    <div className="flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl transition-all hover:border-slate-700">
      <div className="flex justify-between items-center px-4 py-3 bg-slate-900/80 border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="font-medium text-sm text-slate-200 tracking-wide">
            {windowConfig.name}
          </span>
        </div>

        {syncItem && (
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-black tracking-widest uppercase rounded border border-amber-500/30 animate-pulse">
            Sync Override
          </span>
        )}
      </div>

      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        {!currentMedia && (
          <span className="text-slate-600 text-sm italic">
            Waiting for media sequence...
          </span>
        )}

        {currentMedia?.type === "image" && (
          <img
            src={currentMedia.url}
            alt="Sequence media"
            className="w-full h-full object-cover animate-fade-in"
          />
        )}

        {currentMedia?.type === "video" && (
          <video
            src={currentMedia.url}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        )}

        {currentMedia?.type === "blank" && (
          <div className="w-full h-full bg-black"></div>
        )}
      </div>
    </div>
  );
};
