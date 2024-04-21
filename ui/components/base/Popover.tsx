import { Popover as PO, PopoverContent, PopoverTrigger } from "../ui/popover";
import React from "react";

interface IPopoverProps {
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function Popover({
    children,
    content,
    className,
}: IPopoverProps) {
    return (
        <PO>
            <PopoverTrigger className={className}>{children}</PopoverTrigger>
            <PopoverContent>{content}</PopoverContent>
        </PO>
    );
}
