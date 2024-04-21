"use client";
import useModelStore from "@/hooks/states/models";
import useMessageStore from "@/hooks/states/messages";
import server_call from "@/lib/fetch";

import {
    Check,
    Save,
    DownloadCloud,
    RefreshCcw,
    FolderSync,
} from "lucide-react";

export default function Status() {
    return (
        <>
            <div className="fixed bottom-0 h-px w-full peer/status"></div>
            <div className="fixed bottom-[-40px] bg-zinc-950 border-t border-t-zinc-800 w-full text-white transition-transform peer-hover/status:-translate-y-[40px] hover:-translate-y-[40px]">
                <div className="flex flex-row gap-2 p-2">
                    <Check className="bg-green-500 rounded-full p-0.5" />
                    <p>Server Connected</p>

                    <DownloadCloud className="bg-indigo-500 rounded-full p-0.5" />
                    <button
                        onClick={() => {
                            useModelStore
                                .getState()
                                .setModel("loadServerSnapShot");
                        }}
                    >
                        Load Server Snapshot
                    </button>
                    <Save className="bg-blue-500 rounded-full p-0.5" />
                    <button
                        onClick={() => {
                            server_call("snapshot", "post");
                        }}
                    >
                        Save Server Snapshot
                    </button>
                    <RefreshCcw className="bg-orange-500 rounded-full p-0.5" />
                    <button>Reset Server</button>
                </div>
            </div>
        </>
    );
}
