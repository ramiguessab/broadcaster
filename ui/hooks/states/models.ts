import { create } from "zustand";
import type { Models } from "@/components/dashboard/Models";

interface IUseModelStore {
    isOpen: boolean;
    modelName: Models;
    passedValues: any;
    setModel: (modelName: Models, arbitrary?: any) => void;
    setClosed: () => void;
}

const useModelStore = create<IUseModelStore>((set) => ({
    isOpen: true,
    modelName: undefined,
    passedValues: null,
    setModel: (modelName, passedValues) =>
        set(() => ({ isOpen: true, modelName, passedValues })),
    setClosed: () =>
        set(() => ({ isOpen: false, modelOpen: undefined, values: null })),
}));

export default useModelStore;
