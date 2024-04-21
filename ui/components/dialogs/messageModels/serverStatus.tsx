import MessageBase from "../MessageBase";

export function ServerConnected() {
    return (
        <MessageBase
            type="success"
            description="server connected successfully"
            title="server connected"
            hideCancel
        />
    );
}

export function ServerDisconnected() {
    return (
        <MessageBase
            type="error"
            description="server closed please check for any errors in your server's logs"
            title="server disconnected"
            hideCancel
        />
    );
}

export function ServerReset() {
    return (
        <MessageBase
            type="warning"
            description="are you sure to reset the server any unsaved work is gone!!!"
            title="server reset"
        />
    );
}
