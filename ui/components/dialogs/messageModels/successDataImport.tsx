import MessageBase from "../MessageBase";

export default function successDataImport() {
    return (
        <MessageBase
            type="success"
            title="file imported"
            description="the file you selected is set in the workspace"
            hideCancel
        />
    );
}
