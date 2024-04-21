import { useState, useEffect } from "react";
import { FormModel } from "../DialogBase";
import * as z from "zod";
import server_call from "@/lib/fetch";

const formSchema = z.object({
    snapshot: z.string().nonempty(),
});

type SnapshotSchema = z.infer<typeof formSchema>;

export default function LoadServerSnapShot() {
    const [snapshots, setSnapshots] = useState<string[]>([]);
    useEffect(() => {
        server_call("snapshot").then((server_snapshots) => {
            setSnapshots(server_snapshots.files);
        });
    }, []);

    if (snapshots.length === 0) {
        return "loading";
    }

    return (
        <FormModel<SnapshotSchema>
            defaultValues={{ snapshot: snapshots.at(-1) }}
            onSuccess={({ snapshot }) => {
                server_call(`snapshot/${snapshot}`, "put");
            }}
            schema={[
                {
                    label: "snapshot_name",
                    name: "snapshot",
                    placeholder: "choose snapshot to load",
                    type: "select",
                    selectItems: [{ label: "snapshots", values: snapshots }],
                },
            ]}
            resolverSchema={formSchema}
            formName="load snapshot"
            submitLabel="load"
            formDescription="load server with snapshot and sync it with front-end"
        />
    );
}
