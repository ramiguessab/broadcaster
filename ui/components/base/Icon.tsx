import React, { ButtonHTMLAttributes } from "react";
import Tooltip from "./Tooltip";
import { Button } from "../ui/button";

interface IIcon extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    tip: string;
    trasparent?: boolean;
    destructive?: boolean;
    normalSize?: boolean;
    active?: boolean;
}

export default function Icon({
    children,
    tip,
    active,
    trasparent,
    destructive,
    normalSize,
    ...props
}: IIcon) {
    return (
        <Tooltip tip={tip}>
            <Button
                variant={
                    active
                        ? "default"
                        : trasparent
                        ? "ghost"
                        : destructive
                        ? "destructive"
                        : "outline"
                }
                size={normalSize ? "default" : "icon"}
                {...props}
            >
                {children}
            </Button>
        </Tooltip>
    );
}
