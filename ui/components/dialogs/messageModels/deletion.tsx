import MessageBase from "../MessageBase";

export default function Deletion() {
    return (
        <MessageBase
            title="are you sure you want to delete?"
            description="this action has no reverse"
            type="warning"
        />
    );
}
