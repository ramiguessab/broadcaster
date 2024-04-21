"use client";
import { useState, useEffect } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import server_call from "@/lib/fetch";
import { io } from "socket.io-client";

import useMediaStore from "@/hooks/states/medias";
import useSourcesStore from "@/hooks/states/sources";
import useSceneStore from "@/hooks/states/scenes";

import Splash from "@/components/base/splash";
import Sources from "@/components/dashboard/Sources";
import Stream from "@/components/dashboard/Stream";
import Settings from "@/components/scenes/Settings";
import Status from "@/components/status";
import { map_to_object, object_to_map } from "@/lib/map_to_object";

export default function Home() {
    useEffect(() => {
        const socket = io("ws://localhost:8080");

        const unsubscribeScene = useSceneStore.subscribe(
            (newState, prevState) => {
                if (newState.activeScene !== prevState.activeScene) {
                    socket.emit("new_active_scene", newState.activeScene);
                }

                //There is a race condition
                socket.emit("new_scenes", map_to_object(newState.scenes));
            }
        );

        const unsubscribeSource = useSourcesStore.subscribe(
            (newState, prevState) => {
                socket.emit("new_sources", map_to_object(newState.sources, 1));
            }
        );

        const unsubscribeMedia = useMediaStore.subscribe(
            (newState, prevState) => {
                socket.emit("new_medias", map_to_object(newState.medias));
            }
        );

        return () => {
            unsubscribeScene();
            unsubscribeSource();
            unsubscribeMedia();
            socket.disconnect();
        };
    }, []);

    return (
        <TooltipProvider>
            <div className="p-4 flex flex-row justify-evenly">
                <Sources />
                <div className="flex flex-col gap-8 w-3/4">
                    <div className="w-full border border-zinc-900 rounded-xl">
                        <Stream />
                    </div>
                    <Settings />
                </div>
            </div>
            <Status />
        </TooltipProvider>
    );
}
