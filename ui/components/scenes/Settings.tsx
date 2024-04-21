import useSceneStore from "@/hooks/states/scenes";
import useModelStore from "@/hooks/states/models";
import useMessageStore from "@/hooks/states/messages";
import Icon from "../base/Icon";
import Scenes from "./Scenes";
import { RotateCcw, Plus } from "lucide-react";
import useMediaStore from "@/hooks/states/medias";
// import SaveData from "../dashboard/SaveData";

const SettringsControll = () => {
    const setModel = useModelStore((state) => state.setModel);
    const setMessage = useMessageStore((state) => state.setMessage);
    const clearScenes = useSceneStore((state) => state.clearScenes);
    const clearMedias = useMediaStore((state) => state.clearMedias);

    return (
        <div className="dark:text-zinc-200 flex flex-row justify-between">
            <h2 className="font-extrabold text-3xl">Scenes</h2>
            <div className="flex flex-row gap-4">
                <Icon
                    tip="add scene"
                    onClick={() => {
                        setModel("addScene");
                    }}
                >
                    <Plus />
                </Icon>
                {/* <SaveData /> */}
                <Icon
                    tip="reset scenes"
                    destructive
                    onClick={() => {
                        setMessage("deletion", () => {
                            clearScenes();
                            clearScenes();
                        });
                    }}
                >
                    <RotateCcw />
                </Icon>
            </div>
        </div>
    );
};

export default function StreamSettings() {
    return (
        <div className="flex flex-col gap-4 item">
            <SettringsControll />
            <Scenes />
        </div>
    );
}
