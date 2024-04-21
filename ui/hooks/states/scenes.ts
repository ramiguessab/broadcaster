import { StateCreator, create } from "zustand";

import { IScene, IMedia } from "@/components/dashboard/SaveData";

export interface IUseSceneStore {
    activeScene: string;
    alwaysOnTopScene: string;
    previewedScene: string;
    scenes: Map<string, Omit<IScene, "medias">>;
    clearScenes: () => void;
    addScene: (scene: IScene) => void;
    setPreviewedScene: (sceneName: string) => void;
    setActiveScene: (sceneName: string) => void;
    setAllwaysOnTopScene: (sceneName: string) => void;
    reset: (action: "alwaysOnTopScene" | "previewedScene") => void;
    removeScene: (id: string) => void;
}

export const createSceneSlice: StateCreator<IUseSceneStore, [], []> = (
    set
) => ({
    scenes: new Map(),
    activeScene: "",
    alwaysOnTopScene: "",
    previewedScene: "",
    addScene: (scene) =>
        set((state) => {
            return {
                scenes: state.scenes.set(scene.id, scene),
            };
        }),
    clearScenes: () =>
        set(() => ({
            scenes: new Map(),
            medias: new Map(),
            activeScene: "",
            alwaysOnTopScene: "",
            previewedScene: "",
        })),
    removeScene: (id) =>
        set((state) => {
            state.scenes.delete(id);

            return {
                scenes: state.scenes,
            };
        }),
    setActiveScene: (sceneName) => set(() => ({ activeScene: sceneName })),
    setAllwaysOnTopScene: (sceneName) =>
        set(() => ({ alwaysOnTopScene: sceneName })),
    setPreviewedScene: (sceneName) =>
        set(() => ({ previewedScene: sceneName })),
    reset: (action) => set(() => ({ [action]: "" })),
});

const useSceneStore = create<IUseSceneStore>(createSceneSlice);

export function CheckForSceneByName(
    scenes: IUseSceneStore["scenes"],
    name: string
) {
    if (
        Array.from(scenes.values()).findIndex(
            (scene) => scene.name === name
        ) !== -1
    ) {
        return true;
    } else {
        return false;
    }
}

export default useSceneStore;
