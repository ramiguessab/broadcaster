import { getByType } from "@/hooks/states/sources";
import useModelStore from "@/hooks/states/models";
import { v4 as uuid } from "uuid";
import { FormModel } from "../DialogBase";
import useMediaStore from "@/hooks/states/medias";
import useSourcesStore from "@/hooks/states/sources";
import * as z from "zod";
import { IMedia } from "@/components/dashboard/SaveData";

const formSchema = z.object({
    name: z.string().nonempty(),
    position: z.enum(["inside", "outside"]),
    sourceId: z.string(),
});

type Form = z.infer<typeof formSchema>;

export default function AddMedia() {
    const sources = useSourcesStore((state) => state.sources);
    const addMedia = useMediaStore((state) => state.addMedia);

    const passedValues: { ownerId: string } = useModelStore<{
        ownerId: string;
    }>((state) => state.passedValues);

    return (
        <FormModel<Form>
            defaultValues={{ name: "", position: undefined, source: undefined }}
            onSuccess={(values) => {
                addMedia(
                    {
                        placement: {
                            offset: { x: 0, y: 0 },
                            position: values.position,
                            scale: 1,
                            aspectRatio: "4/3",
                            placement: "top left",
                        },
                        id: uuid(),
                        owner: passedValues.ownerId,
                        name: values.name,
                        sourceId: values.sourceId,
                    },
                    passedValues.ownerId
                );
            }}
            schema={[
                {
                    label: "media name",
                    name: "name",
                    placeholder: "eg. logo",
                    type: "input",
                },
                {
                    label: "media position",
                    name: "position",
                    placeholder: "choose where to place this media",
                    type: "select",
                    selectItems: [{ label: "", values: ["inside", "outside"] }],
                },
                {
                    label: "media source",
                    name: "sourceId",
                    placeholder: "choose from where to get the footage",
                    type: "select",
                    selectItems: [
                        {
                            label: "cameras",
                            values: getByType(sources, "cameras").map(
                                (camera) => ({
                                    value: camera.id!,
                                    displayName: camera.name,
                                })
                            ),
                        },
                        {
                            label: "files",
                            values: getByType(sources, "files").map((file) => ({
                                value: file.id!,
                                displayName: file.name,
                            })),
                        },
                    ],
                },
            ]}
            resolverSchema={formSchema}
            formName="add Media"
            submitLabel="add"
            formDescription="complet to add a media"
        />
    );
}
