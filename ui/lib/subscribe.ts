export default function subscribe_to_server(
    server_endpoint: "scene" | "media" | "source",
    onMessage: (data: any) => void
) {
    const sse = new EventSource(
        `http://localhost:8080/subscribe/${server_endpoint}`
    );

    sse.onmessage = (event) => {
        onMessage(JSON.parse(event.data));
    };

    return () => sse.close();
}
