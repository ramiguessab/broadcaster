import { useState, useEffect, useMemo } from "react";
import { FormModel } from "../DialogBase";
import { Camera } from "@/components/dashboard/Sources";
import useSourcesStore, { CheckForCameraByName } from "@/hooks/states/sources";
import { ISource } from "@/hooks/states/sources";
import * as z from "zod";

export default function AddCamera() {
    const [sources, addSource] = useSourcesStore((state) => [
        state.sources,
        state.addSource,
    ]);
    const [deviceCameras, setDeviceCameras] = useState<string[]>([]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            setDeviceCameras(
                devices
                    .filter((device) => device.kind === "videoinput")
                    .map((device) => device.deviceId)
            );
        });
    }, []);

    const formSchema = useMemo(
        () =>
            z
                .object({
                    name: z.string().nonempty(),
                    url: z.string().nonempty(),
                })
                .refine((data) => !CheckForCameraByName(sources, data.name), {
                    path: ["name"],
                    message: "camera all ready exists",
                }),
        [sources]
    );
    return (
        <FormModel<ISource>
            formHead={(values) => (
                <>
                    {values.url && (
                        <Camera hideControlls id={values.url} name="" />
                    )}
                </>
            )}
            defaultValues={{ name: "", url: undefined }}
            onSuccess={(values) => {
                values.type = "camera";
                addSource(values);
            }}
            schema={[
                {
                    label: "camera id",
                    name: "url",
                    placeholder: "choose camera to add",
                    type: "select",
                    selectItems: [{ label: "", values: deviceCameras }],
                },
                {
                    label: "camera name",
                    name: "name",
                    placeholder: "give the camera a name",
                    type: "input",
                },
            ]}
            resolverSchema={formSchema}
            formName="add camera"
            submitLabel="add"
            formDescription="complet to add a connected camera"
        />
    );
}
