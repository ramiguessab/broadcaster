"use client";
import useModelStore from "@/hooks/states/models";
import CreateScene from "../dialogs/formModels/AddScene";
import AddCamera from "../dialogs/formModels/AddCamera";
import AddMedia from "../dialogs/formModels/AddMedia";
import LoadServerSnapShot from "../dialogs/formModels/LoadServerSnapshot";

const models = {
    addScene: CreateScene,
    addCamera: AddCamera,
    addMedia: AddMedia,
    loadServerSnapShot: LoadServerSnapShot,
};

export type Models = keyof typeof models | undefined;

export default function Models() {
    const [isOpen, modelName] = useModelStore((state) => [
        state.isOpen,
        state.modelName,
    ]);
    if (isOpen && modelName) {
        const Model = models[modelName];
        return <Model />;
    }
    return null;
}
