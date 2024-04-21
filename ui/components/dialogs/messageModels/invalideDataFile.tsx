import MessageBase from "../MessageBase";

export default function incorrectDataFile() {
    return (
        <MessageBase
            type="error"
            description="the file you entred is corrupted, empty or incorrect"
            title="unsupported file"
            hideCancel
        />
    );
}
