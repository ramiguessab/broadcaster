import React, { ReactNode } from "react";
import { IMedia } from "../dashboard/SaveData";
import { io } from "socket.io-client";
import {
    ContextMenu,
    ContextMenuItem,
    ContextMenuContent,
    ContextMenuTrigger,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger as CMST,
} from "@/components/ui/context-menu";

interface IStreamElementMenuProps {
    children: React.ReactNode;
    mediaId: string;
    value: {
        position: IMedia["placement"]["position"];
        aspectRatio: IMedia["placement"]["aspectRatio"];
    };
}

const ContextMenuSubTrigger = ({
    disabled,
    children,
}: {
    disabled?: boolean;
    children: ReactNode;
}) => {
    return (
        <CMST className={disabled ? "text-zinc-800" : ""} disabled={disabled}>
            {children}
        </CMST>
    );
};

export default function GridElementMenu({
    children,
    mediaId,
    value,
}: IStreamElementMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>Aspect Ratio</ContextMenuSubTrigger>

                    <ContextMenuSubContent>
                        <ContextMenuRadioGroup
                            value={value.aspectRatio}
                            onValueChange={(aspect_ratio) => {
                                const socket = io("ws://localhost:8080");
                                socket.emit(
                                    "element_changed_aspect_ratio",
                                    mediaId,
                                    aspect_ratio
                                );
                            }}
                        >
                            <ContextMenuRadioItem value="16/9">
                                16:9
                            </ContextMenuRadioItem>
                            <ContextMenuRadioItem value="4/3">
                                4:3
                            </ContextMenuRadioItem>
                            <ContextMenuRadioItem value="1/1">
                                1:1
                            </ContextMenuRadioItem>
                        </ContextMenuRadioGroup>
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>Position</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ContextMenuRadioGroup
                            value={value.position}
                            onValueChange={(position) => {
                                const socket = io("ws://localhost:8080");
                                socket.emit(
                                    "media_changed_position",
                                    mediaId,
                                    position
                                );
                            }}
                        >
                            <ContextMenuRadioItem value="inside">
                                Inside
                            </ContextMenuRadioItem>
                            <ContextMenuRadioItem value="outside">
                                Outside
                            </ContextMenuRadioItem>
                        </ContextMenuRadioGroup>
                    </ContextMenuSubContent>
                </ContextMenuSub>
            </ContextMenuContent>
        </ContextMenu>
    );
}
