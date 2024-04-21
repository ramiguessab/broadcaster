import { StateCreator, create } from "zustand";
import { v4 as uuid } from "uuid";
import exp from "constants";

export interface ISource {
    id?: string;
    name: string;
    type: "camera" | "image" | "video" | "pdf";
    url: string;
}

export interface IUseSourcesStore {
    sources: Map<"files" | "cameras", Map<string, ISource>>;
    addSource: (source: ISource) => void;
    removeSource: (id: string, type: "files" | "cameras") => void;
}

export const createSourceSlice: StateCreator<IUseSourcesStore, [], []> = (
    set
) => ({
    sources: (() => {
        const sources = new Map();
        sources.set("files", new Map());
        sources.set("cameras", new Map());
        sources.set("captures", new Map());
        return sources;
    })(),
    addSource: (source) =>
        set((state) => {
            const type =
                source.type === "image" ||
                source.type === "video" ||
                source.type === "pdf"
                    ? "files"
                    : "cameras";

            const sourcesMap = state.sources.get(type);
            const id = uuid();
            sourcesMap!.set(id, { id, ...source });
            return { sources: state.sources };
        }),
    removeSource: (id, type) =>
        set((state) => {
            state.sources.get(type)?.delete(id);
            return {
                sources: state.sources,
            };
        }),
});

const useSourcesStore = create<IUseSourcesStore>(createSourceSlice);

export function getByType(
    sources: IUseSourcesStore["sources"],
    type: "cameras" | "files"
) {
    return Array.from(sources.get(type)!).map(([id, camera]) => camera);
}

export function CheckForCameraByName(
    sources: IUseSourcesStore["sources"],
    name: string
) {
    const cameras = Array.from(sources.get("cameras")!.values());
    if (cameras.findIndex((camera) => camera.name === name) !== -1) {
        return true;
    } else {
        return false;
    }
}

export function getSource(sources: IUseSourcesStore["sources"], id: string) {
    if (sources.get("cameras")!.has(id)) {
        return sources.get("cameras")!.get(id);
    } else if (sources.get("files")!.has(id)) {
        return sources.get("files")!.get(id);
    } else {
        return null;
    }
}

export default useSourcesStore;
