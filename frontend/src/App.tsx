import { useEffect, useState } from "react";
import type { MediaItem, WindowConfig } from "./types/types";
import { MediaWindow } from "./components/MediaWindow";
import { ControlPanel } from "./components/ControlPanel";
import LoadingSpinner from "./components/LoadState";

export default function App() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const wsURL = import.meta.env.VITE_WS_URL;
  const ws = new WebSocket(wsURL);

  useEffect(() => {
    ws.onopen = () => {
      console.log("Websocket Hub connected!");
    };

    ws.onmessage = (e) => {
      const syncData = JSON.parse(e.data);
      const item: MediaItem = { ...syncData, id: "sync_item" };
      setSyncItem(item);

      setTimeout(() => {
        setSyncItem(null);
      }, item.duration * 1000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket Error: ", err);
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const [syncItem, setSyncItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWindows = async () => {
      try {
        const response = await fetch(`${baseURL}/windows`);
        if (!response.ok)
          throw new Error("Failed to fetch window configurations!");

        const windowsConfiguration = await response.json();
        setWindows(windowsConfiguration);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWindows();
  }, []);

  const handleAddMedia = async (
    windowId: string,
    newItem: Omit<MediaItem, "id">,
  ) => {
    try {
      const response = await fetch(`${baseURL}/windows/${windowId}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error("Failed to save media to Database");

      const savedItem = await response.json();

      setWindows((prevWindows) =>
        prevWindows.map((window) => {
          if (window.windowId === windowId) {
            return { ...window, playlist: [...window.playlist, savedItem] };
          }
          return window;
        }),
      );
    } catch (error) {
      console.error("Error adding new media:", error);
    }
  };

  const handleSync = async (syncItem: Omit<MediaItem, "id">) => {
    try {
      const response = await fetch(`${baseURL}/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(syncItem),
      });

      if (!response.ok) throw new Error("Failed to broadcast sync!");
    } catch (err) {
      console.error("Error syncing media:", err);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-red-950 border border-red-800 text-red-200 px-6 py-4 rounded-lg shadow-lg">
          <h2 className="font-bold text-lg mb-1">Connection Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
        <header className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Media Sequencer
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Global control dashboard for remote displays
            </p>
          </div>

          <ControlPanel
            windows={windows}
            addMedia={handleAddMedia}
            onSync={handleSync}
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {windows.map((window) => (
            <MediaWindow
              key={window.windowId}
              windowConfig={window}
              syncItem={syncItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
