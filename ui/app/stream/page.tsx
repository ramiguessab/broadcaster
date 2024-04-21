"use client";
import Image from "next/image";
import { Medias } from "@/hooks/states/medias";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import subscribe_to_server from "@/lib/subscribe";
import useSourcesStore, { getSource } from "@/hooks/states/sources";
import useMediaStore from "@/hooks/states/medias";
import useSceneStore from "@/hooks/states/scenes";
import { map_to_object, object_to_map } from "@/lib/map_to_object";
import Icon from "@/components/base/Icon";
import { DragControls, motion, useDragControls } from "framer-motion";
import { BugOff, Expand, RefreshCcw } from "lucide-react";
import { GridPlacement } from "@/components/stream/Grids";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    Grid1,
    Grid2,
    Grid3,
    Grid4,
    Grid5,
    Grid6,
    Grid7,
    Grid8,
    Grid9,
    OutterGrid,
    IGridElement,
} from "@/components/stream/Grids";
import useServerData from "@/hooks/useServerData";
import { IMedia } from "@/components/dashboard/SaveData";
import server_call from "@/lib/fetch";

type TStream = "main" | "preview" | "aot";

interface IMultiplexedElements {
    inside: IGridElement[];
    outside: IGridElement[];
}

// function sortGridElements(elements: IGridElement[]): IGridElement[] {
//     const sorted: Sorted = new Map();
//     sorted.set("top_left", { type: "empty", url: "" });
//     sorted.set("top_center", { type: "empty", url: "" });
//     sorted.set("top_right", { type: "empty", url: "" });
//     sorted.set("middle_left", { type: "empty", url: "" });
//     sorted.set("middle_center", { type: "empty", url: "" });
//     sorted.set("middle_right", { type: "empty", url: "" });
//     sorted.set("bottom_left", { type: "empty", url: "" });
//     sorted.set("bottom_center", { type: "empty", url: "" });
//     sorted.set("bottom_right", { type: "empty", url: "" });

//     for (let element of elements) {
//         sorted.set(element.position!.placement, element);
//     }

//     return [
//         sorted.get("top_left")!,
//         sorted.get("top_center")!,
//         sorted.get("top_right")!,
//         sorted.get("middle_left")!,
//         sorted.get("middle_center")!,
//         sorted.get("middle_right")!,
//         sorted.get("bottom_left")!,
//         sorted.get("bottom_center")!,
//         sorted.get("bottom_right")!,
//     ];
// }

function Inside() {
    const [elements, setElements] = useState([]);

    return <Grid2 elements={elements} />;
}

const Grids = [Grid1, Grid2, Grid3, Grid4, Grid5, Grid6, Grid7, Grid8, Grid9];

const Debug = ({ elements }: { elements: IMultiplexedElements }) => {
    const search = useSearchParams();
    const debug = search.get("debug") ? true : false;
    const preview = search.get("preview") ? true : false;

    if (preview && debug) {
        return (
            <div className="absolute left-2 top-2 bg-zinc-200/75 p-2 rounded-md max-w-xl max-h-96 overflow-scroll font-medium z-[99999]">
                <pre>{JSON.stringify(elements, null, 1)}</pre>
            </div>
        );
    } else {
        return null;
    }
};

const PreviewControll = () => {
    const router = useRouter();
    const search = useSearchParams();
    const debug = search.get("debug") ? true : false;
    const preview = search.get("preview") ? true : false;
    if (preview) {
        return (
            <TooltipProvider>
                <div className="hidden group-hover:flex absolute bottom-0 w-full justify-between p-4 bg-gradient-to-t from-zinc-900/75 to-transparent">
                    <Icon
                        tip="open debug overlay"
                        trasparent
                        normalSize
                        active={debug}
                        className={
                            debug
                                ? "dark:bg-green-600 dark:hover:bg-green-700"
                                : ""
                        }
                        onClick={() => {
                            if (!debug) {
                                router.replace("?preview=true&debug=true");
                            } else {
                                router.replace("?preview=true");
                            }
                        }}
                    >
                        <BugOff color={debug ? "#e4e4e7" : "#059669"} />
                    </Icon>
                    <a href="">
                        <Icon tip="refresh stream" trasparent normalSize>
                            <RefreshCcw color="#e4e4e7" />
                        </Icon>
                    </a>
                    <a href="http://localhost:3000/stream" target="_blank">
                        <Icon tip="get stream link" trasparent normalSize>
                            <Expand color="#2563eb" />
                        </Icon>
                    </a>
                </div>
            </TooltipProvider>
        );
    } else {
        return null;
    }
};

let medias: Medias;
let sources: any;
let scenes: any;
let active_scene: string;

function medias_to_elements(medias: IMedia[]) {
    const new_elements: IMultiplexedElements = { inside: [], outside: [] };
    let source;
    medias.forEach((media) => {
        source = getSource(sources, media.sourceId)!;
        new_elements[media.placement.position].push({
            id: media.id,
            placement: media.placement,
            type: source.type,
            url: source.url,
        });
    });

    return new_elements;
}

const Scene = ({ elements }: { elements: IMultiplexedElements }) => {
    const InnerGrid = Grids[elements.inside.length - 1];

    return (
        <>
            {elements.inside.length > 0 && (
                <InnerGrid elements={elements.inside} />
            )}
            {elements.outside.length > 0 && (
                <OutterGrid elements={elements.outside} />
            )}
        </>
    );
};

export default function MainStream() {
    const [mainElements, setMainElements] = useState<IMultiplexedElements>({
        inside: [],
        outside: [],
    });

    const handle_elements = () => {
        setMainElements(medias_to_elements(medias.get(active_scene)!));
    };

    useEffect(() => {
        const socket = io("ws://localhost:8080");

        socket.on("new_active_scene", (new_active_scene) => {
            active_scene = new_active_scene;
            handle_elements();
        });

        socket.on("new_scenes", (new_scenes) => {
            scenes = object_to_map(new_scenes);
        });

        socket.on("new_sources", (new_sources) => {
            sources = object_to_map(new_sources, 1);
            console.log(sources);
        });

        socket.on("new_medias", (new_medias) => {
            medias = object_to_map(new_medias);
            if (active_scene) {
                handle_elements();
            }
        });

        return () => {
            socket.offAny();
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        Promise.all([
            server_call("active_scene"),
            server_call("sources"),
            server_call("scenes"),
            server_call("medias"),
        ]).then(([new_active_scene, new_sources, new_scenes, new_medias]) => {
            active_scene = new_active_scene;
            sources = object_to_map(new_sources, 1);
            scenes = object_to_map(new_scenes);
            medias = object_to_map(new_medias);
            if (active_scene) {
                handle_elements();
            }
        });
    }, []);

    return (
        <div className="relative h-screen group">
            {/* {<Cursor controls={controls} />} */}
            <Debug elements={mainElements} />
            <Scene elements={mainElements} />

            {mainElements.inside.length === 0 &&
                mainElements.outside.length === 0 && (
                    <div className="relative h-screen">
                        <Image src="/smpte.svg" alt="smpte color image" fill />
                    </div>
                )}

            <PreviewControll />
        </div>
    );
}
