import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormMessage,
    FormItem,
    FormLabel,
} from "../ui/form";
import { io } from "socket.io-client";
import useSceneStore from "@/hooks/states/scenes";
import { placementSchema } from "../dashboard/SaveData";
import Select from "../base/Select";
import * as z from "zod";
import { Reorder, useDragControls } from "framer-motion";
import { getByType, getSource } from "@/hooks/states/sources";
import Popover from "../base/Popover";
import { Input } from "../ui/input";

import useMessageStore from "@/hooks/states/messages";
import useSourcesStore from "@/hooks/states/sources";
import { IMedia } from "../dashboard/SaveData";
import useMediaStore from "@/hooks/states/medias";
import useModelStore from "@/hooks/states/models";
import { Button } from "../ui/button";
import Icon from "../base/Icon";
import { Plus, Trash, Replace, Grip } from "lucide-react";
import { PointerEventHandler } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IMediasProps {
    ownerId: string;
}

interface IPositionProps {
    placement: IMedia["placement"];
    onChange: (newPosition: IMedia["placement"]) => void;
}

interface IMediaProps {
    media: IMedia;
    deletable?: boolean;
    remove: () => void;
    onDrag: PointerEventHandler<HTMLButtonElement>;
}

const Media = ({ remove, media, deletable = true, onDrag }: IMediaProps) => {
    const setMessage = useMessageStore((state) => state.setMessage);
    const [sources] = useSourcesStore((state) => [state.sources]);

    return (
        <div className="flex flex-row gap-4 items-center border border-zinc-900 bg-zinc-950 rounded-xl p-2">
            <Icon
                onPointerDown={onDrag}
                className="cursor-grab active:cursor-grabbing"
                tip="hold to move media"
                normalSize
                trasparent
            >
                <Grip color="#e4e4e7" />
            </Icon>
            <p className="dark:text-zinc-200 font-bold capitalize">
                {media.name}
            </p>
            <Select
                onChange={(new_source) => {
                    useMediaStore
                        .getState()
                        .setMediaSource(media.owner, media.id, new_source);
                }}
                items={[
                    {
                        label: "cameras",
                        values: getByType(sources, "cameras").map((camera) => ({
                            value: camera.id!,
                            displayName: camera.name,
                        })),
                    },
                    {
                        label: "files",
                        values: getByType(sources, "files").map((file) => ({
                            value: file.id!,
                            displayName: file.name,
                        })),
                    },
                ]}
                placeholder="Source"
                defaultValue={(() => {
                    return getSource(sources, media.sourceId)?.id as string;
                })()}
            />
            <Select
                onChange={(new_position: any) => {
                    useMediaStore
                        .getState()
                        .setMediaPosition(media.owner, media.id, new_position);
                }}
                items={[{ label: "Position", values: ["inside", "outside"] }]}
                placeholder="Position"
                defaultValue={media.placement.position}
            />
            <Select
                disabled={media.placement.position !== "outside"}
                onChange={(new_aspect_ratio: any) => {
                    useMediaStore
                        .getState()
                        .setMediaAspectRatio(
                            media.owner,
                            media.id,
                            new_aspect_ratio
                        );
                }}
                items={[
                    { label: "Aspect Ratio", values: ["16/9", "4/3", "1/1"] },
                ]}
                placeholder="Aspect Ratio"
                defaultValue={media.placement.aspectRatio}
            />

            <Select
                disabled={media.placement.position !== "outside"}
                onChange={(new_placement: any) => {
                    useMediaStore
                        .getState()
                        .setMediaPlacement(
                            media.owner,
                            media.id,
                            new_placement
                        );
                }}
                items={[
                    {
                        label: "Placement",
                        values: [
                            "top left",
                            "top center",
                            "top right",
                            "middle left",
                            "middle center",
                            "middle right",
                            "bottom left",
                            "bottom center",
                            "bottom right",
                        ],
                    },
                ]}
                placeholder="Placement"
                defaultValue={media.placement.placement}
            />
            <Input
                disabled={media.placement.position !== "outside"}
                className="dark:text-white"
                type="number"
                placeholder="Element Scale"
                value={media.placement.scale}
                onChange={(evt) => {
                    const new_scale = parseFloat(evt.currentTarget.value);
                    useMediaStore
                        .getState()
                        .setMediaScale(media.owner, media.id, new_scale);
                }}
            />

            <Input
                disabled={media.placement.position !== "outside"}
                className="dark:text-white"
                type="number"
                placeholder="X Offset"
                value={media.placement.offset.x}
                onChange={(evt) => {
                    const new_x_offset = parseFloat(evt.currentTarget.value);
                    useMediaStore
                        .getState()
                        .setMediaOffset(
                            media.owner,
                            media.id,
                            "x",
                            new_x_offset
                        );
                }}
            />
            <Input
                disabled={media.placement.position !== "outside"}
                className="dark:text-white"
                type="number"
                placeholder="Y Offset"
                value={media.placement.offset.y}
                onChange={(evt) => {
                    const new_y_offset = parseFloat(evt.currentTarget.value);
                    useMediaStore
                        .getState()
                        .setMediaOffset(
                            media.owner,
                            media.id,
                            "y",
                            new_y_offset
                        );
                }}
            />

            <Icon
                tip="delete media"
                disabled={!deletable}
                destructive
                normalSize
                onClick={() => {
                    setMessage("deletion", remove);
                }}
            >
                <Trash />
            </Icon>
        </div>
    );
};

const DraggableMedia = ({
    deletable,
    media,
    remove,
}: Omit<IMediaProps, "onDrag">) => {
    const controls = useDragControls();
    return (
        <Reorder.Item
            key={media.id}
            value={media}
            as="div"
            dragControls={controls}
            dragListener={false}
        >
            <Media
                onDrag={(event) => {
                    controls.start(event);
                }}
                media={media}
                remove={remove}
                deletable={deletable}
            />
        </Reorder.Item>
    );
};

export default function Medias({ ownerId }: IMediasProps) {
    const [medias, removeMedia, reorderMedias, repositionMedia] = useMediaStore(
        (state) => [
            state.medias,
            state.removeMedia,
            state.reorderMedia,
            state.repositionMedia,
        ]
    );

    const [activeScene] = useSceneStore((state) => [state.activeScene]);

    const setModel = useModelStore((state) => state.setModel);

    const ownerMedia = medias.get(ownerId)!;

    return (
        <>
            <Button
                variant={"secondary"}
                className="dark:text-zinc-200"
                onClick={() => {
                    setModel("addMedia", { ownerId });
                }}
            >
                <Plus className="stroke-zinc-200" /> Add Media
            </Button>
            <Reorder.Group
                axis="y"
                values={ownerMedia}
                onReorder={(newOrder) => {
                    reorderMedias(newOrder, ownerId);
                }}
                as="div"
                className="flex flex-col gap-4"
            >
                {ownerMedia.map((media, i) => {
                    return (
                        <DraggableMedia
                            deletable={
                                !(
                                    ownerMedia.length === 1 &&
                                    activeScene === ownerId
                                )
                            }
                            key={media.id}
                            media={media}
                            remove={() => {
                                removeMedia(ownerId, i);
                            }}
                        />
                    );
                })}
            </Reorder.Group>
        </>
    );
}
