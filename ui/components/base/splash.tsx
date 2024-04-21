import { HorizontalLine } from "./Loading";
import { Tv2 } from "lucide-react";

export default function Splash() {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="flex flex-col gap-6 items-center">
                <Tv2 color="#e4e4e7" size={16 * 12}></Tv2>
                <span className="dark:text-zinc-200 font-extrabold text-5xl ">
                    Broadcaster
                </span>

                <HorizontalLine />
            </div>
        </div>
    );
}
