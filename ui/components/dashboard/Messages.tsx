"use client";
import useMessageStore from "@/hooks/states/messages";
import {
    ServerDisconnected,
    ServerConnected,
    ServerReset,
} from "../dialogs/messageModels/serverStatus";
import invalideDataFile from "../dialogs/messageModels/invalideDataFile";
import successDataImport from "../dialogs/messageModels/successDataImport";
import Deletion from "../dialogs/messageModels/deletion";

const messages = {
    invalidDataFile: invalideDataFile,
    successDataImport: successDataImport,
    deletion: Deletion,
    serverDisconnected: ServerDisconnected,
    serverConnected: ServerConnected,
    serverReset: ServerReset,
};

export type Messages = keyof typeof messages;

export default function Messages() {
    const message = useMessageStore((state) => state.message);
    if (message) {
        const Message = messages[message];
        return <Message />;
    }
    return null;
}
