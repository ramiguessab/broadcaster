type ServerEndpoints =
    | "scenes"
    | "medias"
    | "sources"
    | "active_scene"
    | "element_change"
    | "reset"
    | "snapshot"
    | `snapshot/${string}`;

export default async function server_call(
    server_endpoint: ServerEndpoints,
    method: "get" | "put" | "post" = "get"
) {
    try {
        const res = await fetch(`http://localhost:8080/${server_endpoint}`, {
            headers: { "Content-Type": "application/json" },
            method,
        });
        const data = await res.json();
        return data;
    } catch (err) {
        return err;
    }
}
