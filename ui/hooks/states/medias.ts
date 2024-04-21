import { StateCreator, create } from "zustand";

import { IMedia } from "@/components/dashboard/SaveData";

export type Medias = Map<string, IMedia[]>;

interface IUseMediaStore {
    medias: Medias;
    initNewMedia: (onwerId: string) => void;
    addMedia: (media: IMedia, owner: string) => void;
    removeMedias: (ownerId: string) => void;
    removeMedia: (owner: string, index: number) => void;
    clearMedias: () => void;
    repositionMedia: (
        ownerId: string,
        newPlacement: IMedia["placement"]
    ) => void;
    reorderMedia: (newOrder: IMedia[], ownerId: string) => void;
    setMediaSource: (
        ownerId: string,
        mediaId: string,
        new_source: string
    ) => void;
    setMediaPosition: (
        ownerId: string,
        mediaId: string,
        new_position: IMedia["placement"]["position"]
    ) => void;
    setMediaAspectRatio: (
        ownerId: string,
        mediaId: string,
        new_position: IMedia["placement"]["aspectRatio"]
    ) => void;
    setMediaPlacement: (
        ownerId: string,
        mediaId: string,
        new_placement: IMedia["placement"]["placement"]
    ) => void;
    setMediaScale: (
        ownerId: string,
        mediaId: string,
        new_scale: IMedia["placement"]["scale"]
    ) => void;
    setMediaOffset: (
        ownerId: string,
        mediaId: string,
        axis: "x" | "y",
        new_offset: number
    ) => void;
}

export const createMediaSlice: StateCreator<IUseMediaStore, [], []> = (
    set
) => ({
    medias: new Map(),
    initNewMedia: (onwerId) =>
        set((state) => ({
            medias: state.medias.set(onwerId, []),
        })),
    addMedia: (media, ownerId) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedias = [...ownersMedia, media];
            return {
                medias: state.medias.set(ownerId, newMedias),
            };
        }),
    removeMedia: (ownerId, index) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedia = ownersMedia.filter((_, i) => i !== index);

            return {
                medias: state.medias.set(ownerId, newMedia),
            };
        }),
    removeMedias: (ownerId) =>
        set((state) => {
            state.medias.delete(ownerId);
            return { medias: state.medias };
        }),
    clearMedias: () => set(() => ({ medias: new Map() })),
    repositionMedia: (ownerId, newPlacement) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedias = ownersMedia.map((media) => {
                if (media.id === newPlacement.id!) {
                    delete newPlacement.id;
                    media.placement = newPlacement;
                    return media;
                } else {
                    return media;
                }
            });

            return { medias: state.medias.set(ownerId, newMedias) };
        }),
    reorderMedia: (newOrder, ownerId) =>
        set((state) => {
            return { medias: state.medias.set(ownerId, newOrder) };
        }),
    setMediaSource: (ownerId, mediaId, new_source) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedias = ownersMedia.map((media) => {
                if (media.id === mediaId) {
                    media.sourceId = new_source;
                    return media;
                } else {
                    return media;
                }
            });
            return { medias: state.medias.set(ownerId, newMedias) };
        }),
    setMediaPosition: (ownerId, mediaId, new_position) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedias = ownersMedia.map((media) => {
                if (media.id === mediaId) {
                    media.placement.position = new_position;
                    return media;
                } else {
                    return media;
                }
            });
            return { medias: state.medias.set(ownerId, newMedias) };
        }),
    setMediaAspectRatio: (ownerId, mediaId, new_aspect_ratio) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedias = ownersMedia.map((media) => {
                if (media.id === mediaId) {
                    media.placement.aspectRatio = new_aspect_ratio;
                    return media;
                } else {
                    return media;
                }
            });
            return { medias: state.medias.set(ownerId, newMedias) };
        }),
    setMediaPlacement: (ownerId, mediaId, new_placement) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedias = ownersMedia.map((media) => {
                if (media.id === mediaId) {
                    media.placement.placement = new_placement;
                    return media;
                } else {
                    return media;
                }
            });
            return { medias: state.medias.set(ownerId, newMedias) };
        }),
    setMediaScale: (ownerId, mediaId, new_scale) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedias = ownersMedia.map((media) => {
                if (media.id === mediaId) {
                    media.placement.scale = new_scale;
                    return media;
                } else {
                    return media;
                }
            });
            return { medias: state.medias.set(ownerId, newMedias) };
        }),
    setMediaOffset: (ownerId, mediaId, axis, new_offset) =>
        set((state) => {
            const ownersMedia = state.medias.get(ownerId)!;
            const newMedias = ownersMedia.map((media) => {
                if (media.id === mediaId) {
                    media.placement.offset[axis] = new_offset;
                    return media;
                } else {
                    return media;
                }
            });
            return { medias: state.medias.set(ownerId, newMedias) };
        }),
});

const useMediaStore = create<IUseMediaStore>(createMediaSlice);

export default useMediaStore;
