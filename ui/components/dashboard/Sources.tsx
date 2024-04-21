import { useState, useEffect, useRef } from "react";
import Image from "next/image";
///
import useModelStore from "@/hooks/states/models";
import useSourceStore, { getByType } from "@/hooks/states/sources";
import useMessageStore from "@/hooks/states/messages";
///
import { Trash2 } from "lucide-react";
import { Spinner } from "../base/Loading";
import * as Tabs from "../ui/tabs";
import { Button } from "../ui/button";
import Icon from "../base/Icon";

interface ICameraProps {
    id: string;
    name: string;
    hideControlls?: boolean;
    remove?: () => void;
}

export const Camera = ({ id, name, hideControlls, remove }: ICameraProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(true);
    const setMessage = useMessageStore((state) => state.setMessage);

    useEffect(() => {
        if (videoRef.current !== null) {
            navigator.mediaDevices
                .getUserMedia({
                    video: { width: 1920, height: 1080, deviceId: id },
                })
                .then((stream) => {
                    videoRef.current!.srcObject = stream;

                    setLoading(false);
                });
        }
    }, [id]);

    return (
        <div className="flex flex-col gap-2 items-center">
            {loading && <Spinner />}
            <div className="relative">
                <video
                    ref={videoRef}
                    className="aspect-video rounded-xl"
                    autoPlay
                    loop
                />

                {!loading && !hideControlls && (
                    <div className="absolute bottom-0 flex flex-row justify-evenly p-2 w-full">
                        <Icon
                            tip="delete camera"
                            destructive
                            onClick={() => {
                                setMessage("deletion", remove);
                            }}
                        >
                            <Trash2 className="stroke-red-600" />
                        </Icon>
                    </div>
                )}
            </div>
            {name && (
                <p className="dark:text-zinc-200 capitalize font-semibold underline">
                    {name}
                </p>
            )}
        </div>
    );
};

function Cameras() {
    const setModel = useModelStore((state) => state.setModel);
    const [sources, removeSource] = useSourceStore((state) => [
        state.sources,
        state.removeSource,
    ]);

    const cameras = getByType(sources, "cameras");

    return (
        <div className="flex flex-col gap-6">
            <Button
                className="font-bold w-full "
                onClick={() => {
                    setModel("addCamera");
                }}
            >
                Add Camera
            </Button>
            {cameras.map((camera) => (
                <Camera
                    key={camera!.id}
                    id={camera.url}
                    name={camera.name}
                    remove={() => {
                        removeSource(camera.id!, "cameras");
                    }}
                />
            ))}
        </div>
    );
}

interface IFileProps {
    name: string;
    type: "video" | "image";
    url: string;
    remove: () => void;
}

export const File = ({ name, type, url, remove }: IFileProps) => {
    const setMessage = useMessageStore((state) => state.setMessage);

    return (
        <div className="flex flex-col gap-2 h-52 ">
            <div className="dark:text-zinc-200 w-full relative">
                <iframe src={url} className="aspect-video rounded-xl mx-auto" />

                <div className="absolute top-2 left-2 flex flex-row justify-evenly p-2">
                    <Icon
                        tip="delete camera"
                        destructive
                        onClick={() => {
                            setMessage("deletion", remove);
                        }}
                    >
                        <Trash2 className="stroke-red-600" />
                    </Icon>
                </div>
            </div>
            <p className="dark:text-zinc-200 font-bold underline mx-auto">
                {name}
            </p>
        </div>
    );
};

const Files = () => {
    const [sources, addSource, removeSource] = useSourceStore((state) => [
        state.sources,
        state.addSource,
        state.removeSource,
    ]);
    const files = getByType(sources, "files");
    return (
        <div className="flex flex-col gap-6">
            <Button
                className="font-bold w-full"
                onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true;
                    input.accept = "image/* , video/* , application/pdf";
                    input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files!;
                        let selectedFile: File;
                        let url: string, type: string, name: string;
                        for (let i = 0; i < files.length; i++) {
                            selectedFile = files.item(i)!;
                            const fr = new FileReader();

                            fr.readAsDataURL(selectedFile);

                            fr.onload = (evt) => {
                                url = URL.createObjectURL(selectedFile);
                                name = selectedFile.name;
                                const splitedType =
                                    selectedFile.type.split("/");
                                if (
                                    splitedType[0] === "image" ||
                                    splitedType[0] === "video"
                                ) {
                                    type = splitedType[0];
                                } else if (selectedFile.type) {
                                    type = "pdf";
                                }

                                if (
                                    type === "image" ||
                                    type === "video" ||
                                    type === "pdf"
                                ) {
                                    addSource({
                                        name,
                                        type,
                                        url,
                                    });
                                }
                            };
                        }
                    };
                    input.click();
                    input.remove();
                }}
            >
                Add File
            </Button>
            {files.map((file, i) => (
                <File
                    remove={() => {
                        removeSource(file.id!, "files");
                    }}
                    key={i}
                    name={file.name}
                    type={file.type as "image" | "video"}
                    url={file.url}
                />
            ))}
        </div>
    );
};

export default function Sources() {
    return (
        <div className="w-1/5 h-[calc(100dvh_-_2rem)] overflow-scroll sticky top-4">
            <Tabs.Tabs defaultValue="cameras" className=" ">
                <Tabs.TabsList className="grid grid-cols-2">
                    <Tabs.TabsTrigger value="cameras">Cameras</Tabs.TabsTrigger>
                    <Tabs.TabsTrigger value="files">Files</Tabs.TabsTrigger>
                </Tabs.TabsList>

                <Tabs.TabsContent value="cameras">
                    <Cameras />
                </Tabs.TabsContent>
                <Tabs.TabsContent value="files">
                    <Files />
                </Tabs.TabsContent>
            </Tabs.Tabs>
        </div>
    );
}
