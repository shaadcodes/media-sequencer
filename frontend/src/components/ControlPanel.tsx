import { useForm, type SubmitHandler } from "react-hook-form";
import type { MediaItem, MediaType, WindowConfig } from "../types/types";
import { toast, ToastContainer } from "react-toastify";

type ControlPanelProps = {
  windows: WindowConfig[];
  addMedia: (windowId: string, item: Omit<MediaItem, "id">) => void;
  onSync: (item: Omit<MediaItem, "id">) => void;
};

type FormInputs = {
  window: string;
  mediaType: MediaType;
  mediaURL: string;
  duration: number;
};

export const ControlPanel = ({
  windows,
  addMedia,
  onSync,
}: ControlPanelProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      window: windows[0]?.windowId || "",
      mediaType: "image",
      mediaURL: "",
      duration: 10,
    },
  });

  const notifyAddMedia = () => toast("Media Queued!");

  const currentMedia = watch("mediaType");
  const inputStyles =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  const addMediaButton: SubmitHandler<FormInputs> = (data) => {
    if (!data.window) return;
    addMedia(data.window, {
      type: data.mediaType,
      url: data.mediaType === "blank" ? "" : data.mediaURL,
      duration: data.duration,
    });
    reset({ ...data, mediaURL: "" });
  };

  const syncButton: SubmitHandler<FormInputs> = (data) => {
    onSync({
      type: data.mediaType,
      url: data.mediaType === "blank" ? "" : data.mediaURL,
      duration: data.duration,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex-1 min-w-[320px]">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
          Add Media
        </h2>
        <form
          onSubmit={handleSubmit(addMediaButton)}
          className="flex flex-col gap-3"
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <select
                className={inputStyles}
                {...register("window", { required: "Required" })}
              >
                {windows.map((window) => (
                  <option key={window.windowId} value={window.windowId}>
                    {window.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select className={inputStyles} {...register("mediaType")}>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="blank">Blank Screen</option>
              </select>
            </div>
          </div>

          {currentMedia !== "blank" && (
            <div>
              <input
                type="text"
                placeholder="Enter media URL..."
                className={inputStyles}
                {...register("mediaURL", { required: "Media URL is required" })}
              />
              {errors.mediaURL && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.mediaURL.message}
                </span>
              )}
            </div>
          )}

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Duration (sec)"
                className={inputStyles}
                {...register("duration", {
                  required: "Required",
                  min: { value: 1, message: "Min 1s" },
                  valueAsNumber: true,
                })}
              />
            </div>
            <button
              onClick={notifyAddMedia}
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors whitespace-nowrap"
            >
              Queue Media
            </button>
            <ToastContainer theme="dark" />
          </div>
        </form>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex-1 min-w-75 flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-semibold text-green-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Global Sync
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Forces all remote displays to instantly play the selected media
            above. Normal playlists resume automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit(syncButton)}
          className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-md transition-colors shadow-[0_0_15px_rgba(217,119,6,0.3)]"
        >
          Trigger Broadcast
        </button>
      </section>
    </div>
  );
};
