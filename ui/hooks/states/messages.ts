import { create } from "zustand";
import type { Messages } from "@/components/dashboard/Messages";

interface IUseModelStore {
    message: Messages | null;
    setMessage: (
        message: Messages,
        onAction?: () => void,
        onClose?: () => void
    ) => void;
    onAction: () => void;
    onClose: () => void;
    closeMessage: () => void;
}

const useMessageStore = create<IUseModelStore>((set) => ({
    message: null,
    onAction: () => {},
    onClose: () => {},
    setMessage: (message, onAction, onClose) =>
        set(() => ({ message, onAction, onClose })),
    closeMessage: () =>
        set(() => ({ message: null, onAction: () => {}, onClose: () => {} })),
}));

export default useMessageStore;
