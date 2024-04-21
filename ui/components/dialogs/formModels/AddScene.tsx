import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import useMediaStore from "@/hooks/states/medias";
import useSceneStore, { CheckForSceneByName } from "@/hooks/states/scenes";
import { FormModel } from "../DialogBase";
import * as z from "zod";
import { IScene } from "@/components/dashboard/SaveData";

export default function CreateScene() {
    const [scenes, addScene] = useSceneStore((state) => [
        state.scenes,
        state.addScene,
    ]);

    const initNewMedia = useMediaStore((state) => state.initNewMedia);

    const sceneCreationSchema = useMemo(
        () =>
            z
                .object({
                    name: z.string().nonempty(),
                })
                .refine((data) => !CheckForSceneByName(scenes, data.name), {
                    path: ["name"],
                    message: "name all ready exists",
                }),
        [scenes]
    );
    return (
        <FormModel<IScene>
            formName="create scene"
            formDescription="complet the form to create an empty scene"
            onSuccess={(values) => {
                const id = uuid();
                initNewMedia(id);
                addScene({
                    id: id,
                    name: values.name,
                });
            }}
            defaultValues={{ name: "", shape: undefined }}
            resolverSchema={sceneCreationSchema}
            submitLabel="create scene"
            schema={[
                {
                    label: "name",
                    name: "name",
                    placeholder: "enter scene name (eg. audience rear)",
                    type: "input",
                },
            ]}
        />
    );
}
