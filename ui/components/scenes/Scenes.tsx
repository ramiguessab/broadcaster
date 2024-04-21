import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Medias from "./Medias";
import { getSource } from "@/hooks/states/sources";
import { IScene } from "../dashboard/SaveData";
import useMessageStore from "@/hooks/states/messages";
import useSceneStore from "@/hooks/states/scenes";
import Icon from "../base/Icon";

import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "../ui/collapsible";
import {
    Trash,
    ChevronUp,
    ChevronDown,
    Circle,
    PictureInPicture2,
    FlaskConical,
} from "lucide-react";
import useMediaStore from "@/hooks/states/medias";
import useSourcesStore from "@/hooks/states/sources";

interface IScenesActions {
    sceneId: string;
    onRemove: () => void;
}

const SceneActions = ({ sceneId, onRemove }: IScenesActions) => {
    const [
        reset,
        setActiveScene,
        setAllwaysOnTopScene,
        setPreviewedScene,
        activeScene,
        alwaysOnTopScene,
        previewedScene,
    ] = useSceneStore((state) => [
        state.reset,
        state.setActiveScene,
        state.setAllwaysOnTopScene,
        state.setPreviewedScene,
        state.activeScene,
        state.alwaysOnTopScene,
        state.previewedScene,
    ]);
    const sources = useSourcesStore((state) => state.sources);
    const [medias] = useMediaStore((state) => [
        state.medias,
        // state.repositionMedia,
    ]);
    const allwaysOnTop = alwaysOnTopScene === sceneId;
    const active = activeScene === sceneId;
    const previewed = previewedScene === sceneId;
    const sceneMedias = medias.get(sceneId)!;
    const disabled = sceneMedias.length === 0;

    return (
        <div className="flex flex-row gap-4">
            <Icon
                disabled={allwaysOnTop || disabled}
                tip="click to activate scene"
                onClick={() => {
                    if (previewed) {
                        reset("previewedScene");
                    }
                    setActiveScene(sceneId);
                }}
            >
                <Circle color="#f0f0f0" fill={active ? "#f0f0f0" : "#0000"} />
            </Icon>
            <Icon
                tip="make it allways on top"
                disabled={active || disabled}
                onClick={() => {
                    if (allwaysOnTop) {
                        reset("alwaysOnTopScene");
                    } else {
                        if (previewed) {
                            reset("previewedScene");
                        }
                        setAllwaysOnTopScene(sceneId);
                    }
                }}
            >
                <PictureInPicture2
                    color="#3b82f6"
                    fill={allwaysOnTop ? "#3b82f650" : "#0000"}
                />
            </Icon>
            <Icon
                tip="preview the scene"
                disabled={active || allwaysOnTop || disabled}
                onClick={() => {
                    if (previewed) {
                        reset("previewedScene");
                    } else {
                        setPreviewedScene(sceneId);
                    }
                }}
            >
                <FlaskConical
                    color="#10b981"
                    fill={previewed ? "#10b98150" : "#0000"}
                />
            </Icon>
            <Icon
                tip="delete the scene"
                destructive
                disabled={active || allwaysOnTop || previewed}
                onClick={onRemove}
            >
                <Trash />
            </Icon>
        </div>
    );
};

interface ISceneProps {
    id: string;
    name: string;
}

const Scene = ({ id, name }: ISceneProps) => {
    const [isOpen, setOpen] = useState(false);
    const removeMedias = useMediaStore((state) => state.removeMedias);
    const removeScene = useSceneStore((state) => state.removeScene);
    const setMessage = useMessageStore((state) => state.setMessage);

    return (
        <Collapsible open={isOpen} onOpenChange={setOpen}>
            <div className="dark:text-zinc-200 flex flex-row justify-between w-full border border-zinc-800 p-4 rounded-xl">
                <div className="inline-flex gap-4 items-center">
                    <CollapsibleTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                    </CollapsibleTrigger>
                    <p className="font-bold text-lg capitalize">{name}</p>
                </div>
                <SceneActions
                    sceneId={id}
                    onRemove={() => {
                        setMessage("deletion", () => {
                            removeMedias(id);
                            removeScene(id);
                        });
                    }}
                />
            </div>
            <CollapsibleContent className="flex flex-col gap-4 pt-4 pl-8">
                <Medias ownerId={id} />
            </CollapsibleContent>
        </Collapsible>
    );
};

interface IScenesProps {}

export default function Scenes({}: IScenesProps) {
    const [scenesMap] = useSceneStore((state) => [state.scenes]);
    const scenes = Array.from(scenesMap.values());
    return (
        <>
            {scenes.length === 0 ? (
                <p className="dark:text-zinc-200 m-auto">No Scenes</p>
            ) : (
                scenes.map(({ id, name }) => (
                    <Scene id={id} key={id} name={name} />
                ))
            )}
        </>
    );
}
