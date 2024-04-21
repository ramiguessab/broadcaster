import { StateCreator, create } from "zustand";

interface IUseCameraCacheStore {
    camerasCache: { [id: string]: MediaStream };
    addCameraToCache: (id: string, stream: MediaStream) => void;
    removeCameraFromCache: (id: string) => void;
}

export const createCameraCacheSlice: StateCreator<
    IUseCameraCacheStore,
    [],
    []
> = (set) => ({
    camerasCache: {},
    addCameraToCache: (id, stream) =>
        set((state) => ({
            camerasCache: { ...state.camerasCache, [id]: stream },
        })),
    removeCameraFromCache: (id) =>
        set((state) => {
            delete state.camerasCache[id];
            return { camerasCache: { ...state.camerasCache } };
        }),
});

const useCameraCacheStore = create<IUseCameraCacheStore>(
    createCameraCacheSlice
);

export default useCameraCacheStore;
