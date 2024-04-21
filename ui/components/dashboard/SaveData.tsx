import * as z from "zod";

export const placementSchema = z.object({
    id: z.string().optional(),
    position: z.enum(["inside", "outside"]),
    scale: z.number(),
    offset: z.object({ x: z.number(), y: z.number() }),
    placement: z.enum([
        "top left",
        "top center",
        "top right",
        "middle left",
        "middle center",
        "middle right",
        "bottom left",
        "bottom center",
        "bottom right",
    ]),
    aspectRatio: z.enum(["16/9", "4/3", "1/1"]),
});

const mediaSchema = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    sourceId: z.string().nonempty(),
    owner: z.string().nonempty(),
    placement: placementSchema,
});

export type IMedia = z.infer<typeof mediaSchema>;

const sceneSchema = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
});

export type IScene = z.infer<typeof sceneSchema>;
