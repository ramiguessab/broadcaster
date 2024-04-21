import useMessageStore from "@/hooks/states/messages";
import { Ban, AlertTriangle, BadgeInfo, BadgeCheck } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MessagesTypes = "success" | "error" | "warning" | "info";

interface IMessageBase {
    type: MessagesTypes;
    description: string;
    title: string;
    hideCancel?: boolean;
}

const icons = {
    success: BadgeCheck,
    error: Ban,
    warning: AlertTriangle,
    info: BadgeInfo,
};

export default function MessageBase({
    type,
    description,
    title,
    hideCancel,
}: IMessageBase) {
    const [message, closeMessage, onAction, onCancel] = useMessageStore(
        (state) => [
            state.message,
            state.closeMessage,
            state.onAction,
            state.onClose,
        ]
    );
    const Icon = icons[type];
    return (
        <AlertDialog
            open={message !== null}
            onOpenChange={(state) => {
                if (state === false) {
                    closeMessage();
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader className="dark:text-zinc-200 capitalize">
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className="inline-flex items-center justify-around w-full">
                        <Icon size={16 * 5} />
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {!hideCancel && (
                        <AlertDialogCancel
                            onClick={onCancel}
                            className="dark:text-zinc-200"
                        >
                            Cancel
                        </AlertDialogCancel>
                    )}
                    <AlertDialogAction onClick={onAction}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
