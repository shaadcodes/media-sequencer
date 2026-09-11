export type MediaType = "image" | "video" | "blank";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  duration: number;
}

export interface WindowConfig {
  windowId: string;
  name: string;
  playlist: MediaItem[];
}
